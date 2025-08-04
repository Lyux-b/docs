import { Browser, Page } from 'puppeteer';

export class AdvancedBrowser {
  private browser: Browser | null = null;
  private page: Page | null = null;

  async ensureBrowser() {
    if (!this.browser) {
      this.browser = await import('puppeteer').then(p => p.default).launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      this.page = await this.browser.newPage();
    }
  }

  async scrollToElement(selector: string) {
    await this.ensureBrowser();
    await this.page!.evaluate((sel) => {
      const element = document.querySelector(sel);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, selector);
  }

  async getElementAttribute(selector: string, attribute: string) {
    await this.ensureBrowser();
    const value = await this.page!.$eval(
      selector,
      (el, attr) => el.getAttribute(attr),
      attribute
    );
    return value;
  }

  async selectOption(selector: string, value: string) {
    await this.ensureBrowser();
    await this.page!.select(selector, value);
  }

  async hoverElement(selector: string) {
    await this.ensureBrowser();
    await this.page!.hover(selector);
  }

  async getPageTitle() {
    await this.ensureBrowser();
    return await this.page!.title();
  }

  async getPageURL() {
    await this.ensureBrowser();
    return this.page!.url();
  }

  async waitForNavigation() {
    await this.ensureBrowser();
    await this.page!.waitForNavigation({ waitUntil: 'networkidle2' });
  }

  async executeJavaScript(code: string) {
    await this.ensureBrowser();
    return await this.page!.evaluate(code);
  }

  async setViewport(width: number, height: number) {
    await this.ensureBrowser();
    await this.page!.setViewport({ width, height });
  }

  async getCookies() {
    await this.ensureBrowser();
    return await this.page!.cookies();
  }

  async setCookie(name: string, value: string, domain?: string) {
    await this.ensureBrowser();
    await this.page!.setCookie({
      name,
      value,
      domain: domain || new URL(await this.page!.url()).hostname,
    });
  }

  async clearCookies() {
    await this.ensureBrowser();
    const client = await this.page!.target().createCDPSession();
    await client.send('Network.clearBrowserCookies');
  }

  async getLocalStorage() {
    await this.ensureBrowser();
    return await this.page!.evaluate(() => {
      const items: Record<string, string> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          items[key] = localStorage.getItem(key) || '';
        }
      }
      return items;
    });
  }

  async setLocalStorage(key: string, value: string) {
    await this.ensureBrowser();
    await this.page!.evaluate((k, v) => {
      localStorage.setItem(k, v);
    }, key, value);
  }

  async clearLocalStorage() {
    await this.ensureBrowser();
    await this.page!.evaluate(() => {
      localStorage.clear();
    });
  }

  async getSessionStorage() {
    await this.ensureBrowser();
    return await this.page!.evaluate(() => {
      const items: Record<string, string> = {};
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key) {
          items[key] = sessionStorage.getItem(key) || '';
        }
      }
      return items;
    });
  }

  async setSessionStorage(key: string, value: string) {
    await this.ensureBrowser();
    await this.page!.evaluate((k, v) => {
      sessionStorage.setItem(k, v);
    }, key, value);
  }

  async clearSessionStorage() {
    await this.ensureBrowser();
    await this.page!.evaluate(() => {
      sessionStorage.clear();
    });
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
    }
  }
}