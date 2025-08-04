# Швидкий старт - Browser MCP Server

## 🚀 Швидке налаштування (5 хвилин)

### 1. Встановлення залежностей

```bash
cd browser-mcp-server
npm install
npm run build
```

### 2. Налаштування MCP клієнта

Додайте в конфігурацію вашого MCP клієнта:

```json
{
  "mcpServers": {
    "browser": {
      "command": "node",
      "args": ["/workspace/browser-mcp-server/dist/index.js"]
    }
  }
}
```

### 3. Тестування

Запитайте AI:
```
"Перейди на https://httpbin.org/get і отримай заголовок сторінки"
```

## 📋 Доступні команди

| Команда | Опис | Приклад |
|---------|------|---------|
| `browser_navigate` | Перехід на URL | `{"url": "https://google.com"}` |
| `browser_screenshot` | Знімання скріншоту | `{"path": "screenshot.png"}` |
| `browser_get_text` | Отримання тексту | `{"selector": "h1"}` |
| `browser_click` | Натискання на елемент | `{"selector": "button"}` |
| `browser_type` | Введення тексту | `{"selector": "input", "text": "hello"}` |
| `browser_wait` | Очікування елемента | `{"selector": ".loading", "timeout": 5000}` |
| `browser_close` | Закриття браузера | `{}` |

## 🎯 Популярні сценарії

### Пошук в Google
```
"Відкрий Google, введи 'Browser MCP' і натисни кнопку пошуку"
```

### Знімання скріншоту
```
"Перейди на github.com і зроби скріншот"
```

### Заповнення форми
```
"Перейди на httpbin.org/forms/post, заповни форму з іменем 'Test' і email 'test@example.com'"
```

## ⚠️ Важливі зауваження

1. **Браузер запускається у видимому режимі** - ви побачите вікно браузера
2. **Потрібен Chrome/Chromium** - встановлений в системі
3. **GUI середовище** - для Linux потрібен X11 або Wayland
4. **Безпека** - використовуйте тільки в довірених середовищах

## 🔧 Усунення проблем

### Помилка "Cannot find module"
```bash
npm install
npm run build
```

### Браузер не запускається
```bash
# Ubuntu/Debian
sudo apt-get install chromium-browser

# CentOS/RHEL
sudo yum install chromium
```

### Помилки безпеки в Linux
```bash
sudo apt-get install -y gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget
```

## 📚 Додаткові ресурси

- [Повна документація](README.md)
- [Інтеграція з клієнтами](INTEGRATION.md)
- [Приклади використання](examples/usage-examples.md)
- [Розширені можливості](src/advanced-browser.ts)

## 🆘 Підтримка

Якщо у вас виникли проблеми:

1. Перевірте логи в консолі
2. Переконайтеся, що всі залежності встановлено
3. Спробуйте запустити в режимі розробки: `npm run dev`
4. Перевірте, чи працює браузер вручну

---

**Готово!** Тепер ви можете використовувати Browser MCP Server для автоматизації браузера через AI.