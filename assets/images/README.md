# 🎨 Иконки приложения ZenCash

Этот каталог содержит все иконки для приложения управления финансами.

## 📱 Созданные иконки

### Основные иконки
- `icon.png` (1024x1024) - Основная иконка приложения
- `adaptive-icon.png` (1024x1024) - Адаптивная иконка для Android
- `splash-icon.png` (400x400) - Иконка для экрана загрузки
- `favicon.png` (32x32) - Favicon для веб-версии

### SVG исходники
- `icon.svg` - Исходный SVG файл основной иконки
- `adaptive-icon.svg` - Исходный SVG файл адаптивной иконки
- `splash-icon.svg` - Исходный SVG файл иконки загрузки
- `favicon.svg` - Исходный SVG файл favicon

## 🎨 Дизайн иконки

### Концепция
Иконка представляет собой стилизованную монету с символом доллара ($) в центре, что символизирует управление финансами.

### Цветовая схема
- **Основной градиент**: От синего (#4F8CFF) к зеленому (#34D399)
- **Акценты**: Оранжевый (#FFB347), красный (#F87171), фиолетовый (#A78BFA)
- **Фон**: Белый с прозрачностью

### Элементы дизайна
- Круглая форма монеты с двойной обводкой
- Символ рубля в центре
- Декоративные графики и точки
- Градиентные переходы

## 🔧 Генерация иконок

### Автоматическая генерация
Для создания PNG файлов из SVG используйте скрипт:

```bash
node scripts/generate-icons.js
```

### Ручная генерация
Если нужно создать дополнительные размеры, используйте:

1. **Sharp** (рекомендуется):
```bash
npm install sharp
```

2. **Онлайн конвертеры**:
   - https://convertio.co/svg-png/
   - https://cloudconvert.com/svg-to-png

## 📱 Размеры для разных платформ

### iOS
- 1024x1024 (App Store)
- 180x180 (iPhone 6 Plus)
- 120x120 (iPhone 6)
- 87x87 (iPhone 6 Plus Spotlight)
- 80x80 (iPhone 6 Spotlight)
- 76x76 (iPad)
- 60x60 (iPhone 6 Settings)
- 40x40 (iPhone 6 Settings)
- 29x29 (iPhone 6 Settings)

### Android
- 512x512 (Play Store)
- 192x192 (xxxhdpi)
- 144x144 (xxhdpi)
- 96x96 (xhdpi)
- 72x72 (hdpi)
- 48x48 (mdpi)

### Web
- 32x32 (favicon)
- 16x16 (favicon)

## 🚀 Использование в приложении

### Expo/React Native
Иконки автоматически подхватываются из `app.json`:

```json
{
  "expo": {
    "icon": "./assets/images/icon.png",
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      }
    },
    "plugins": [
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/splash-icon.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#ffffff"
        }
      ]
    ]
  }
}
```

### Нативная разработка

#### iOS
1. Добавьте иконки в `ios/YourApp/Images.xcassets/AppIcon.appiconset/`
2. Используйте Asset Catalog для автоматического масштабирования

#### Android
1. Поместите иконки в соответствующие папки `mipmap-*`
2. Используйте `adaptive-icon.png` для Android 8.0+

## 🎨 Кастомизация

### Изменение цветов
Отредактируйте SVG файлы, изменив значения в градиентах:

```svg
<linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
  <stop offset="0%" style="stop-color:#YOUR_COLOR;stop-opacity:1" />
  <stop offset="100%" style="stop-color:#YOUR_COLOR;stop-opacity:1" />
</linearGradient>
```

### Изменение символа валюты
Замените символ $ на нужный в SVG файлах:

```svg
<text x="512" y="580" font-family="Arial, sans-serif" font-size="180" font-weight="bold" text-anchor="middle" fill="#FFFFFF">€</text>
```

## 📋 Чек-лист для публикации

- [ ] Основная иконка 1024x1024 создана
- [ ] Адаптивная иконка для Android создана
- [ ] Иконка splash screen создана
- [ ] Favicon для веб создан
- [ ] Все иконки протестированы на разных устройствах
- [ ] Иконки соответствуют гайдлайнам платформ
- [ ] Пути в app.json обновлены

## 🔗 Полезные ссылки

- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/ios/icons-and-images/app-icon/)
- [Material Design Icons](https://material.io/design/iconography/system-icons.html)
- [Expo Icons Documentation](https://docs.expo.dev/guides/app-icons/) 