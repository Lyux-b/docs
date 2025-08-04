#!/usr/bin/env node

import { BrowserMCPServer } from '../src/index.js';

// Приклад автоматизації пошуку в Google
async function googleSearchExample() {
  const server = new BrowserMCPServer();
  
  try {
    // 1. Перехід на Google
    console.log('Переходимо на Google...');
    await server.navigate('https://google.com');
    
    // 2. Очікування завантаження пошукового поля
    console.log('Очікуємо пошукове поле...');
    await server.wait('input[name="q"]');
    
    // 3. Введення пошукового запиту
    console.log('Вводимо пошуковий запит...');
    await server.type('input[name="q"]', 'Browser MCP');
    
    // 4. Натискання кнопки пошуку
    console.log('Натискаємо кнопку пошуку...');
    await server.click('input[name="btnK"]');
    
    // 5. Очікування результатів
    console.log('Очікуємо результати...');
    await server.wait('#search');
    
    // 6. Отримання тексту результатів
    console.log('Отримуємо результати...');
    const results = await server.getText('#search');
    console.log('Результати пошуку:', results);
    
    // 7. Знімання скріншоту
    console.log('Знімаємо скріншот...');
    await server.screenshot('google-search-results.png');
    
    // 8. Закриття браузера
    console.log('Закриваємо браузер...');
    await server.close();
    
    console.log('Автоматизація завершена успішно!');
    
  } catch (error) {
    console.error('Помилка під час автоматизації:', error);
    await server.close();
  }
}

// Запуск прикладу
googleSearchExample();