#!/bin/bash

echo "🚀 Налаштування Browser MCP Server..."

# Перевірка наявності Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не знайдено. Будь ласка, встановіть Node.js 18+"
    exit 1
fi

# Перевірка версії Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Потрібна Node.js версія 18+. Поточна версія: $(node -v)"
    exit 1
fi

echo "✅ Node.js версія: $(node -v)"

# Встановлення залежностей
echo "📦 Встановлення залежностей..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Помилка встановлення залежностей"
    exit 1
fi

# Збірка проекту
echo "🔨 Збірка проекту..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Помилка збірки проекту"
    exit 1
fi

# Створення конфігураційного файлу для MCP клієнта
echo "⚙️ Створення конфігурації MCP..."

CURRENT_DIR=$(pwd)
MCP_CONFIG="{
  \"mcpServers\": {
    \"browser\": {
      \"command\": \"node\",
      \"args\": [\"$CURRENT_DIR/dist/index.js\"],
      \"env\": {
        \"NODE_ENV\": \"production\"
      }
    }
  }
}"

echo "$MCP_CONFIG" > mcp-client-config.json

echo "✅ Налаштування завершено!"
echo ""
echo "📋 Наступні кроки:"
echo "1. Додайте конфігурацію з файлу mcp-client-config.json до вашого MCP клієнта"
echo "2. Запустіть сервер командою: npm start"
echo "3. Для розробки використовуйте: npm run dev"
echo ""
echo "📖 Детальна документація: README.md"
echo "🔧 Приклади використання: examples/"