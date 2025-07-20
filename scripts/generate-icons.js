const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Функция для создания PNG из SVG
async function generatePNGFromSVG(svgPath, pngPath, size) {
  try {
    console.log(`Генерирую ${path.basename(pngPath)} размером ${size}x${size}...`);
    
    // Читаем SVG файл
    const svgBuffer = fs.readFileSync(svgPath);
    
    // Конвертируем SVG в PNG
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(pngPath);
    
    console.log(`✅ Создан: ${path.basename(pngPath)}`);
  } catch (error) {
    console.error(`❌ Ошибка при создании ${path.basename(pngPath)}:`, error.message);
  }
}

// Размеры иконок для разных платформ
const iconSizes = {
  'icon.png': 1024,           // Основная иконка
  'adaptive-icon.png': 1024,  // Адаптивная иконка для Android
  'splash-icon.png': 400,     // Иконка для splash screen
  'favicon.png': 32,          // Favicon для веб
};

// Дополнительные размеры для iOS
const iosIconSizes = {
  'ios-180.png': 180,
  'ios-120.png': 120,
  'ios-87.png': 87,
  'ios-80.png': 80,
  'ios-76.png': 76,
  'ios-60.png': 60,
  'ios-40.png': 40,
  'ios-29.png': 29,
};

// Дополнительные размеры для Android
const androidIconSizes = {
  'android-512.png': 512,
  'android-192.png': 192,
  'android-144.png': 144,
  'android-96.png': 96,
  'android-72.png': 72,
  'android-48.png': 48,
};

// Объединяем все размеры
const allIconSizes = { ...iconSizes, ...iosIconSizes, ...androidIconSizes };

// Основная функция
async function generateAllIcons() {
  console.log('🎨 Генерация иконок для приложения...\n');
  
  const imagesDir = path.join(__dirname, '..', 'assets', 'images');
  
  // Создаем папки если их нет
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }
  
  // Генерируем все иконки
  for (const [filename, size] of Object.entries(allIconSizes)) {
    const svgPath = path.join(imagesDir, filename.replace('.png', '.svg'));
    const pngPath = path.join(imagesDir, filename);
    
    if (fs.existsSync(svgPath)) {
      await generatePNGFromSVG(svgPath, pngPath, size);
    } else {
      console.log(`❌ SVG файл не найден: ${path.basename(svgPath)}`);
    }
  }
  
  console.log('\n🎉 Генерация иконок завершена!');
  console.log('\n📱 Созданные файлы:');
  
  // Показываем созданные файлы
  const files = fs.readdirSync(imagesDir);
  files.forEach(file => {
    if (file.endsWith('.png')) {
      const stats = fs.statSync(path.join(imagesDir, file));
      console.log(`  ✅ ${file} (${stats.size} bytes)`);
    }
  });
  
  console.log('\n📝 Следующие шаги:');
  console.log('1. Проверьте созданные PNG файлы в папке assets/images/');
  console.log('2. Убедитесь, что пути в app.json указывают на правильные файлы');
  console.log('3. Для iOS добавьте иконки в ios/YourApp/Images.xcassets/');
  console.log('4. Для Android иконки автоматически подхватятся из assets/images/');
}

// Запускаем генерацию
generateAllIcons().catch(console.error); 