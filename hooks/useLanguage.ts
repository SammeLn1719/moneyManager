import { Translations } from '@/constants/Translations';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import { NativeModules, Platform } from 'react-native';

const LANGUAGE_STORAGE_KEY = '@app_language';

export type Language = 'ru' | 'en';

// Глобальный callback для уведомления о смене языка
let languageChangeCallbacks: (() => void)[] = [];

export const subscribeToLanguageChange = (callback: () => void) => {
  languageChangeCallbacks.push(callback);
  return () => {
    languageChangeCallbacks = languageChangeCallbacks.filter(cb => cb !== callback);
  };
};

export const notifyLanguageChange = () => {
  languageChangeCallbacks.forEach(callback => callback());
};

export function useLanguage() {
  const [language, setLanguage] = useState<Language>('ru');
  const [isLoading, setIsLoading] = useState(true);
  const [forceUpdate, setForceUpdate] = useState(0);

  // Получение языка системы
  const getSystemLanguage = (): Language => {
    try {
      let locale: string;
      
      if (Platform.OS === 'ios') {
        locale = NativeModules.SettingsManager.settings.AppleLocale || 
                 NativeModules.SettingsManager.settings.AppleLanguages[0];
      } else {
        locale = NativeModules.I18nManager.localeIdentifier;
      }
      
      // Извлекаем код языка (первые 2 символа)
      const languageCode = locale.split('_')[0].toLowerCase();
      
      // Проверяем, поддерживается ли язык
      if (languageCode === 'ru' || languageCode.startsWith('ru')) {
        return 'ru';
      } else {
        return 'en'; // По умолчанию английский
      }
    } catch (error) {
      console.log('Error getting system language:', error);
      return 'en'; // По умолчанию английский
    }
  };

  // Загрузка сохраненного языка
  const loadSavedLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (savedLanguage && (savedLanguage === 'ru' || savedLanguage === 'en')) {
        setLanguage(savedLanguage as Language);
      } else {
        // Если нет сохраненного языка, используем язык системы
        const systemLanguage = getSystemLanguage();
        setLanguage(systemLanguage);
        await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, systemLanguage);
      }
    } catch (error) {
      console.log('Error loading saved language:', error);
      const systemLanguage = getSystemLanguage();
      setLanguage(systemLanguage);
    } finally {
      setIsLoading(false);
    }
  };

  // Изменение языка
  const changeLanguage = async (newLanguage: Language) => {
    try {
      setLanguage(newLanguage);
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage);
      
      // Уведомляем все подписчиков о смене языка
      notifyLanguageChange();
      
      // Принудительно обновляем состояние
      setForceUpdate(prev => prev + 1);
    } catch (error) {
      console.log('Error saving language:', error);
    }
  };

  // Получение перевода
  const t = useCallback((key: keyof typeof Translations.ru): string => {
    return Translations[language][key] || key;
  }, [language, forceUpdate]);

  // Получение перевода с параметрами
  const tWithParams = useCallback((key: keyof typeof Translations.ru, params: Record<string, string | number>): string => {
    let translation = Translations[language][key] || key;
    
    // Заменяем параметры в строке
    Object.entries(params).forEach(([param, value]) => {
      translation = translation.replace(new RegExp(`{${param}}`, 'g'), String(value));
    });
    
    return translation;
  }, [language, forceUpdate]);

  useEffect(() => {
    loadSavedLanguage();
  }, []);

  return {
    language,
    changeLanguage,
    t,
    tWithParams,
    isLoading,
    forceUpdate,
  };
} 