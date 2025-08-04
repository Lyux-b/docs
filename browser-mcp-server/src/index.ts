#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import puppeteer, { Browser, Page } from 'puppeteer';

class BrowserMCPServer {
  private server: Server;
  private browser: Browser | null = null;
  private page: Page | null = null;

  constructor() {
    this.server = new Server(
      {
        name: 'browser-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
  }

  private setupToolHandlers() {
    // List tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'browser_navigate',
            description: 'Navigate to a URL in the browser',
            inputSchema: {
              type: 'object',
              properties: {
                url: {
                  type: 'string',
                  description: 'The URL to navigate to',
                },
              },
              required: ['url'],
            },
          },
          {
            name: 'browser_screenshot',
            description: 'Take a screenshot of the current page',
            inputSchema: {
              type: 'object',
              properties: {
                path: {
                  type: 'string',
                  description: 'Path to save the screenshot (optional)',
                },
              },
            },
          },
          {
            name: 'browser_get_text',
            description: 'Get text content from the current page',
            inputSchema: {
              type: 'object',
              properties: {
                selector: {
                  type: 'string',
                  description: 'CSS selector to get text from (optional)',
                },
              },
            },
          },
          {
            name: 'browser_click',
            description: 'Click an element on the page',
            inputSchema: {
              type: 'object',
              properties: {
                selector: {
                  type: 'string',
                  description: 'CSS selector of the element to click',
                },
              },
              required: ['selector'],
            },
          },
          {
            name: 'browser_type',
            description: 'Type text into an input field',
            inputSchema: {
              type: 'object',
              properties: {
                selector: {
                  type: 'string',
                  description: 'CSS selector of the input field',
                },
                text: {
                  type: 'string',
                  description: 'Text to type',
                },
              },
              required: ['selector', 'text'],
            },
          },
          {
            name: 'browser_wait',
            description: 'Wait for an element to appear on the page',
            inputSchema: {
              type: 'object',
              properties: {
                selector: {
                  type: 'string',
                  description: 'CSS selector to wait for',
                },
                timeout: {
                  type: 'number',
                  description: 'Timeout in milliseconds (default: 5000)',
                },
              },
              required: ['selector'],
            },
          },
          {
            name: 'browser_close',
            description: 'Close the browser',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
        ],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'browser_navigate':
            return await this.navigate(args.url);
          case 'browser_screenshot':
            return await this.screenshot(args.path);
          case 'browser_get_text':
            return await this.getText(args.selector);
          case 'browser_click':
            return await this.click(args.selector);
          case 'browser_type':
            return await this.type(args.selector, args.text);
          case 'browser_wait':
            return await this.wait(args.selector, args.timeout);
          case 'browser_close':
            return await this.close();
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  private async ensureBrowser() {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      this.page = await this.browser.newPage();
    }
  }

  private async navigate(url: string) {
    await this.ensureBrowser();
    await this.page!.goto(url, { waitUntil: 'networkidle2' });
    return {
      content: [
        {
          type: 'text',
          text: `Successfully navigated to ${url}`,
        },
      ],
    };
  }

  private async screenshot(path?: string) {
    await this.ensureBrowser();
    const screenshotPath = path || `screenshot-${Date.now()}.png`;
    await this.page!.screenshot({ path: screenshotPath, fullPage: true });
    return {
      content: [
        {
          type: 'text',
          text: `Screenshot saved to ${screenshotPath}`,
        },
      ],
    };
  }

  private async getText(selector?: string) {
    await this.ensureBrowser();
    let text: string;
    
    if (selector) {
      text = await this.page!.$eval(selector, (el) => el.textContent || '');
    } else {
      text = await this.page!.evaluate(() => document.body.innerText);
    }

    return {
      content: [
        {
          type: 'text',
          text: text || 'No text found',
        },
      ],
    };
  }

  private async click(selector: string) {
    await this.ensureBrowser();
    await this.page!.click(selector);
    return {
      content: [
        {
          type: 'text',
          text: `Clicked element: ${selector}`,
        },
      ],
    };
  }

  private async type(selector: string, text: string) {
    await this.ensureBrowser();
    await this.page!.type(selector, text);
    return {
      content: [
        {
          type: 'text',
          text: `Typed "${text}" into ${selector}`,
        },
      ],
    };
  }

  private async wait(selector: string, timeout: number = 5000) {
    await this.ensureBrowser();
    await this.page!.waitForSelector(selector, { timeout });
    return {
      content: [
        {
          type: 'text',
          text: `Element ${selector} appeared after waiting`,
        },
      ],
    };
  }

  private async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
    }
    return {
      content: [
        {
          type: 'text',
          text: 'Browser closed successfully',
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Browser MCP Server started');
  }
}

// Start the server
const server = new BrowserMCPServer();
server.run().catch(console.error);