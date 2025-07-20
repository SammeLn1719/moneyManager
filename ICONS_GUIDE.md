# 🎨 Руководство по иконкам ZenCash

## ✅ Что создано

### Иконки приложения
- **Основная иконка**: `assets/images/icon.png` (1024x1024)
- **Адаптивная иконка**: `assets/images/adaptive-icon.png` (1024x1024)
- **Splash Screen**: `assets/images/splash-icon.png` (400x400)
- **Favicon**: `assets/images/favicon.png` (32x32)

### SVG исходники
- `assets/images/icon.svg`
- `assets/images/adaptive-icon.svg`
- `assets/images/splash-icon.svg`
- `assets/images/favicon.svg`

### Инструменты
- `scripts/generate-icons.js` - Генерация PNG из SVG
- `scripts/test-icons.js` - Проверка иконок
- `scripts/preview-icons.html` - Предварительный просмотр
- `assets/images/README.md` - Подробная документация

## 🚀 Быстрый старт

### 1. Проверка иконок
```bash
node scripts/test-icons.js
```

### 2. Предварительный просмотр
Откройте в браузере: `scripts/preview-icons.html`

### 3. Локальное тестирование
```bash
npx expo start
```

### 4. Сборка приложения
```bash
# Preview сборка
npx eas build --platform android --profile preview

# Production сборка
npx eas build --platform all --profile production
```

## 📱 Конфигурация

### app.json настроен для:
- ✅ iOS: `com.sammeln.zencash`
- ✅ Android: `com.sammeln.zencash`
- ✅ Иконки: Все пути указаны правильно
- ✅ Splash Screen: Настроен с новой иконкой

### EAS Build настроен:
- ✅ Проект создан: `@sammeln/moneyManager`
- ✅ Конфигурация: `eas.json` создан
- ✅ Профили: development, preview, production

## 🎨 Дизайн иконки

### Концепция
- 💰 Стилизованная монета с символом доллара
- 📊 Декоративные графики финансовой активности
- 🎨 Современный градиентный дизайн

### Цвета
- 🔵 Основной: Синий (#4F8CFF) → Зеленый (#34D399)
- 🟠 Акцент 1: Оранжевый (#FFB347)
- 🔴 Акцент 2: Красный (#F87171)
- 🟣 Акцент 3: Фиолетовый (#A78BFA)

## 🔧 Кастомизация

### Изменение цветов
Отредактируйте SVG файлы, изменив градиенты:
```svg
<linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
  <stop offset="0%" style="stop-color:#YOUR_COLOR;stop-opacity:1" />
  <stop offset="100%" style="stop-color:#YOUR_COLOR;stop-opacity:1" />
</linearGradient>
```

### Изменение символа валюты
Замените $ на нужный символ в SVG файлах:
```svg
<text x="512" y="580" font-family="Arial, sans-serif" font-size="180" font-weight="bold" text-anchor="middle" fill="#FFFFFF">€</text>
```

### Регенерация PNG
```bash
node scripts/generate-icons.js
```

## 📋 Чек-лист для публикации

- [x] Основная иконка 1024x1024 создана
- [x] Адаптивная иконка для Android создана
- [x] Splash screen иконка создана
- [x] Favicon для веб создан
- [x] app.json настроен правильно
- [x] EAS Build настроен
- [ ] Тестирование на реальных устройствах
- [ ] Проверка в App Store/Play Store
- [ ] Публикация приложения

## 🔗 Полезные команды

```bash
# Проверка иконок
node scripts/test-icons.js

# Генерация PNG
node scripts/generate-icons.js

# Локальный запуск
npx expo start

# Сборка Android
npx eas build --platform android --profile preview

# Сборка iOS
npx eas build --platform ios --profile preview

# Сборка всех платформ
npx eas build --platform all --profile production

# Отправка в магазины
npx eas submit --platform android
npx eas submit --platform ios
```

## 🎉 Готово!

Ваше приложение ZenCash теперь имеет:
- ✅ Уникальные профессиональные иконки
- ✅ Правильную конфигурацию для всех платформ
- ✅ Готовность к сборке и публикации
- ✅ Инструменты для кастомизации

**Следующий шаг**: Запустите `npx eas build` для создания первой сборки с новыми иконками! 