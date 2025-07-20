import { Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { subscribeToLanguageChange, useLanguage } from '@/hooks/useLanguage';
import { CategoriesProvider } from '../../components/CategoriesContext';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { t, language } = useLanguage();
  const [updateKey, setUpdateKey] = useState(0);

  // Подписываемся на изменения языка
  useEffect(() => {
    const unsubscribe = subscribeToLanguageChange(() => {
      setUpdateKey(prev => prev + 1);
    });
    
    return unsubscribe;
  }, []);

  // Принудительно обновляем навигацию при смене языка
  useEffect(() => {
    setUpdateKey(prev => prev + 1);
  }, [language]);

  return (
    <CategoriesProvider>
      <Tabs
        key={`${language}-${updateKey}`} // Комбинированный ключ для надежного обновления
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: {
            height: Platform.OS === 'ios' ? 88 : 60,
            paddingBottom: Platform.OS === 'ios' ? 20 : 8,
            paddingTop: 8,
          },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: t('home'),
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: t('explore'),
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
          }}
        />
      </Tabs>
    </CategoriesProvider>
  );
}
