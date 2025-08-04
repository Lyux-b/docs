# Інтеграція Browser MCP Server

Цей документ містить інструкції по інтеграції Browser MCP Server з різними MCP клієнтами.

## Загальна конфігурація

Додайте наступну конфігурацію до вашого MCP клієнта:

```json
{
  "mcpServers": {
    "browser": {
      "command": "node",
      "args": ["/path/to/browser-mcp-server/dist/index.js"],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

## Інтеграція з Claude Desktop

1. Відкрийте Claude Desktop
2. Перейдіть в Settings → AI Models
3. Знайдіть розділ "MCP Servers"
4. Додайте новий сервер з наступними параметрами:
   - **Name**: browser
   - **Command**: node
   - **Arguments**: `/path/to/browser-mcp-server/dist/index.js`

## Інтеграція з Cursor

1. Відкрийте Cursor
2. Перейдіть в Settings → Extensions → MCP
3. Додайте конфігурацію сервера в `mcp.json`:

```json
{
  "mcpServers": {
    "browser": {
      "command": "node",
      "args": ["/path/to/browser-mcp-server/dist/index.js"]
    }
  }
}
```

## Інтеграція з VS Code + MCP Extension

1. Встановіть MCP extension для VS Code
2. Створіть файл `.vscode/mcp.json`:

```json
{
  "mcpServers": {
    "browser": {
      "command": "node",
      "args": ["/path/to/browser-mcp-server/dist/index.js"]
    }
  }
}
```

## Інтеграція з Ollama

1. Створіть файл конфігурації для Ollama:

```json
{
  "mcpServers": {
    "browser": {
      "command": "node",
      "args": ["/path/to/browser-mcp-server/dist/index.js"]
    }
  }
}
```

2. Запустіть Ollama з MCP підтримкою:

```bash
ollama run llama2 --mcp-config config.json
```

## Перевірка інтеграції

Після налаштування ви можете перевірити роботу сервера, запитавши AI:

```
"Перейди на google.com і зроби скріншот"
```

Або:

```
"Відкрий браузер, перейди на https://example.com і отримай заголовок сторінки"
```

## Розширені можливості

### Налаштування браузера

Ви можете змінити налаштування браузера в файлі `src/index.ts`:

```typescript
this.browser = await puppeteer.launch({
  headless: false, // true для невидимого режиму
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-web-security',
    '--disable-features=VizDisplayCompositor'
  ],
});
```

### Додавання нових інструментів

Для додавання нових інструментів:

1. Додайте новий інструмент в `setupToolHandlers()` метод
2. Створіть відповідний метод обробки
3. Перебудуйте проект: `npm run build`

### Логування

Для включення детального логування додайте в конфігурацію:

```json
{
  "mcpServers": {
    "browser": {
      "command": "node",
      "args": ["/path/to/browser-mcp-server/dist/index.js"],
      "env": {
        "NODE_ENV": "production",
        "DEBUG": "browser-mcp:*"
      }
    }
  }
}
```

## Усунення проблем

### Помилка "Command not found"

Переконайтеся, що:
- Node.js встановлено та доступне в PATH
- Шлях до `dist/index.js` правильний
- Файл `dist/index.js` існує (виконайте `npm run build`)

### Помилка "Cannot find module"

Переконайтеся, що:
- Всі залежності встановлено: `npm install`
- Проект збудовано: `npm run build`

### Браузер не запускається

Переконайтеся, що:
- Chrome/Chromium встановлено
- Система підтримує GUI (для headless: false)
- Достатньо прав для запуску браузера

### Помилки безпеки

Для Linux систем може знадобитися:

```bash
sudo apt-get install -y gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget
```

## Підтримка

Якщо у вас виникли проблеми:

1. Перевірте логи в консолі
2. Переконайтеся, що всі залежності встановлено
3. Спробуйте запустити в режимі розробки: `npm run dev`
4. Перевірте, чи працює браузер вручну