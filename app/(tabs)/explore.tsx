import "@/assets/css/global.css";
import { useCategories } from '@/components/CategoriesContext';
import { CategoryManager } from '@/components/CategoryManager';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { subscribeToLanguageChange, useLanguage } from '@/hooks/useLanguage';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Keyboard, SafeAreaView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function TabTwoScreen() {
  const { categories, setCategories, isLoading, resetToDefaults } = useCategories();
  const colorScheme = useColorScheme();
  const theme = colorScheme ?? 'light';
  const colors = Colors[theme];
  const { t } = useLanguage();
  const [updateKey, setUpdateKey] = useState(0);
  

  useEffect(() => {
    const unsubscribe = subscribeToLanguageChange(() => {
      setUpdateKey(prev => prev + 1);
    });
    
    return unsubscribe;
  }, []);
  
  const handleReset = () => {
    Alert.alert(
      t('resetDataTitle'),
      t('resetDataMessage'),
      [
        { text: t('cancel'), style: 'cancel' },
        { 
          text: t('reset'), 
          style: 'destructive',
          onPress: resetToDefaults
        }
      ]
    );
  };
  
  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ marginTop: 16, fontSize: 16, color: colors.textSecondary }}>
            {t('loading')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView key={updateKey} style={{ flex: 1, backgroundColor: colors.background }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View 
          style={{ 
            flex: 1,
            paddingHorizontal: screenWidth > 400 ? 24 : 16,
            paddingTop: screenHeight > 800 ? 20 : 16,
            paddingBottom: 100, 
          }}
        >

          <LanguageSwitcher style={{ marginBottom: 16 }} />
          
          <Text style={{ 
            textAlign: 'center', 
            color: colors.primary, 
            fontWeight: 'bold', 
            marginBottom: 20,
            fontSize: screenWidth > 400 ? 24 : 20
          }}>
            {t('categoryManagement')}
          </Text>
          
          <CategoryManager value={categories} onChange={setCategories} />
          
        
          <TouchableOpacity
            onPress={handleReset}
            style={{
              backgroundColor: colors.danger,
              paddingVertical: 12,
              paddingHorizontal: 20,
              borderRadius: 8,
              marginTop: 20,
              shadowColor: colors.cardShadow,
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 2,
              elevation: 2,
            }}
          >
            <Text style={{ 
              color: colors.dangerText, 
              fontWeight: 'bold', 
              fontSize: 14, 
              textAlign: 'center' 
            }}>
              {t('resetData')}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
