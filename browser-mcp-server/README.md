# Browser MCP Server

MCP (Model Context Protocol) сервер для автоматизації браузера та взаємодії з веб-сторінками.

## Можливості

- **Навігація**: Перехід на URL-адреси
- **Скріншоти**: Знімання скріншотів сторінок
- **Отримання тексту**: Вилучення тексту з елементів
- **Кліки**: Натискання на елементи
- **Введення тексту**: Введення тексту в поля форми
- **Очікування**: Очікування появи елементів
- **Закриття браузера**: Закриття браузера

## Встановлення

1. Перейдіть в директорію проекту:
```bash
cd browser-mcp-server
```

2. Встановіть залежності:
```bash
npm install
```

3. Збудуйте проект:
```bash
npm run build
```

## Використання

### Запуск сервера

```bash
npm start
```

### Розробка

Для розробки з автоматичним перезапуском:

```bash
npm run dev
```

### Інтеграція з MCP клієнтом

Додайте наступну конфігурацію до вашого MCP клієнта:

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

## Доступні інструменти

### browser_navigate
Перехід на URL-адресу.

**Параметри:**
- `url` (string, обов'язковий): URL для переходу

**Приклад:**
```json
{
  "name": "browser_navigate",
  "arguments": {
    "url": "https://google.com"
  }
}
```

### browser_screenshot
Знімання скріншоту поточної сторінки.

**Параметри:**
- `path` (string, опціональний): Шлях для збереження скріншоту

**Приклад:**
```json
{
  "name": "browser_screenshot",
  "arguments": {
    "path": "screenshot.png"
  }
}
```

### browser_get_text
Отримання тексту з елемента або всієї сторінки.

**Параметри:**
- `selector` (string, опціональний): CSS селектор елемента

**Приклад:**
```json
{
  "name": "browser_get_text",
  "arguments": {
    "selector": "h1"
  }
}
```

### browser_click
Натискання на елемент сторінки.

**Параметри:**
- `selector` (string, обов'язковий): CSS селектор елемента

**Приклад:**
```json
{
  "name": "browser_click",
  "arguments": {
    "selector": "button[type='submit']"
  }
}
```

### browser_type
Введення тексту в поле форми.

**Параметри:**
- `selector` (string, обов'язковий): CSS селектор поля введення
- `text` (string, обов'язковий): Текст для введення

**Приклад:**
```json
{
  "name": "browser_type",
  "arguments": {
    "selector": "input[name='q']",
    "text": "Browser MCP"
  }
}
```

### browser_wait
Очікування появи елемента на сторінці.

**Параметри:**
- `selector` (string, обов'язковий): CSS селектор елемента
- `timeout` (number, опціональний): Таймаут в мілісекундах (за замовчуванням: 5000)

**Приклад:**
```json
{
  "name": "browser_wait",
  "arguments": {
    "selector": ".search-results",
    "timeout": 10000
  }
}
```

### browser_close
Закриття браузера.

**Приклад:**
```json
{
  "name": "browser_close",
  "arguments": {}
}
```

## Приклад використання

Ось приклад послідовності дій для пошуку в Google:

1. **Перехід на Google:**
```json
{
  "name": "browser_navigate",
  "arguments": {
    "url": "https://google.com"
  }
}
```

2. **Введення пошукового запиту:**
```json
{
  "name": "browser_type",
  "arguments": {
    "selector": "input[name='q']",
    "text": "Browser MCP"
  }
}
```

3. **Натискання кнопки пошуку:**
```json
{
  "name": "browser_click",
  "arguments": {
    "selector": "input[name='btnK']"
  }
}
```

4. **Очікування результатів:**
```json
{
  "name": "browser_wait",
  "arguments": {
    "selector": "#search"
  }
}
```

5. **Знімання скріншоту результатів:**
```json
{
  "name": "browser_screenshot",
  "arguments": {
    "path": "google-search-results.png"
  }
}
```

## Вимоги

- Node.js 18+
- Puppeteer (встановлюється автоматично)
- Chrome/Chromium браузер

## Безпека

⚠️ **Увага**: Цей сервер запускає браузер у видимому режимі та може взаємодіяти з веб-сторінками. Використовуйте його тільки в довірених середовищах.

## Ліцензія

MIT