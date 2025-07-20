const fs = require('fs');
const path = require('path');

console.log('🎨 Тестирование иконок ZenCash...\n');

// Проверяем наличие всех необходимых файлов
const requiredFiles = [
  'assets/images/icon.png',
  'assets/images/adaptive-icon.png',
  'assets/images/splash-icon.png',
  'assets/images/favicon.png',
  'assets/images/icon.svg',
  'assets/images/adaptive-icon.svg',
  'assets/images/splash-icon.svg',
  'assets/images/favicon.svg'
];

let allFilesExist = true;

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    console.log(`✅ ${file} (${stats.size} bytes)`);
  } else {
    console.log(`❌ ${file} - НЕ НАЙДЕН`);
    allFilesExist = false;
  }
});

console.log('\n📱 Проверка конфигурации app.json...');

// Проверяем конфигурацию app.json
const appJsonPath = path.join(__dirname, '..', 'app.json');
if (fs.existsSync(appJsonPath)) {
  const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
  
  const iconPath = appJson.expo?.icon;
  const adaptiveIconPath = appJson.expo?.android?.adaptiveIcon?.foregroundImage;
  const splashIconPath = appJson.expo?.plugins?.[1]?.[1]?.image;
  const faviconPath = appJson.expo?.web?.favicon;
  
  console.log(`✅ Основная иконка: ${iconPath}`);
  console.log(`✅ Адаптивная иконка: ${adaptiveIconPath}`);
  console.log(`✅ Splash иконка: ${splashIconPath}`);
  console.log(`✅ Favicon: ${faviconPath}`);
  
  // Проверяем, что пути указывают на существующие файлы
  const iconExists = fs.existsSync(path.join(__dirname, '..', iconPath));
  const adaptiveIconExists = fs.existsSync(path.join(__dirname, '..', adaptiveIconPath));
  const splashIconExists = fs.existsSync(path.join(__dirname, '..', splashIconPath));
  const faviconExists = fs.existsSync(path.join(__dirname, '..', faviconPath));
  
  if (iconExists && adaptiveIconExists && splashIconExists && faviconExists) {
    console.log('\n🎉 Все иконки правильно настроены!');
  } else {
    console.log('\n⚠️  Некоторые иконки не найдены по указанным путям');
  }
} else {
  console.log('❌ app.json не найден');
  allFilesExist = false;
}

console.log('\n📋 Рекомендации:');
console.log('1. Запустите "npx expo start" для локального тестирования');
console.log('2. Откройте scripts/preview-icons.html для просмотра иконок');
console.log('3. Используйте "npx eas build" для создания сборки с иконками');

if (allFilesExist) {
  console.log('\n✅ Все готово для сборки!');
} else {
  console.log('\n❌ Некоторые файлы отсутствуют. Запустите "node scripts/generate-icons.js"');
} 