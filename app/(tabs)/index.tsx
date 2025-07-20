import { useCategories } from '@/components/CategoriesContext';
import { PaymentManager } from '@/components/PaymentManager';
import { SpeedometerDiagram } from '@/components/SpeedometerDiagram';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { subscribeToLanguageChange, useLanguage } from '@/hooks/useLanguage';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Keyboard, SafeAreaView, ScrollView, Text, TouchableWithoutFeedback, View } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function HomeScreen() {
  const { categories, setCategories, isLoading } = useCategories();
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

  const handlePaymentAdd = (categoryIndex: number, amount: number) => {
    const updatedCategories = [...categories];
    updatedCategories[categoryIndex] = {
      ...updatedCategories[categoryIndex],
      amount: updatedCategories[categoryIndex].amount + amount
    };
    setCategories(updatedCategories);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
          <ThemedText style={{ marginTop: 16, fontSize: 16, color: colors.textSecondary }}>
            {t('loading')}
          </ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView key={updateKey} style={{ flex: 1, backgroundColor: colors.background }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={{ 
            alignItems: 'center',
            paddingHorizontal: screenWidth > 400 ? 24 : 16,
            paddingTop: screenHeight > 800 ? 20 : 16,
            paddingBottom: 100, 
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          
          <ThemedText type="title" style={{ 
            marginBottom: 20, 
            textAlign: 'center',
            fontSize: screenWidth > 400 ? 28 : 24,
            color: colors.textPrimary
          }}>
            {t('expenseManager')}
          </ThemedText>
          
          {categories.length > 0 && (
            <View style={{ 
              backgroundColor: colors.listItemHover, 
              borderRadius: 12, 
              padding: screenWidth > 400 ? 20 : 16, 
              marginBottom: 20,
              width: '100%',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: colors.cardBorder,
            }}>
              <ThemedText style={{ 
                fontSize: screenWidth > 400 ? 16 : 14, 
                color: colors.textSecondary, 
                marginBottom: 4 
              }}>
                {t('totalExpenses')}
              </ThemedText>
              <ThemedText style={{ 
                fontSize: screenWidth > 400 ? 28 : 24, 
                fontWeight: 'bold', 
                color: colors.textPrimary 
              }}>
                {categories.reduce((sum, cat) => sum + cat.amount, 0).toLocaleString()} ₽
              </ThemedText>
            </View>
          )}
          
          <PaymentManager 
            categories={categories} 
            onPaymentAdd={handlePaymentAdd} 
          />
          
          <SpeedometerDiagram categories={categories} size={screenWidth > 400 ? 280 : 260} />
          
          {categories.length > 0 && (
            <View style={{ 
              backgroundColor: colors.cardBackground, 
              borderRadius: 12, 
              padding: screenWidth > 400 ? 20 : 16, 
              marginTop: 20,
              width: '100%',
              shadowColor: colors.cardShadow,
              shadowOpacity: 0.05,
              shadowRadius: 2,
              elevation: 2,
              borderWidth: 1,
              borderColor: colors.cardBorder,
            }}>
              <ThemedText style={{ 
                fontSize: screenWidth > 400 ? 20 : 18, 
                fontWeight: 'bold', 
                marginBottom: 12, 
                textAlign: 'center',
                color: colors.textPrimary
              }}>
                {t('expenseCategories')}
              </ThemedText>
              {categories.map((category, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: screenWidth > 400 ? 10 : 8,
                    borderBottomWidth: index !== categories.length - 1 ? 1 : 0,
                    borderColor: colors.listItemBorder,
                  }}
                >
                  <View 
                    style={{ 
                      width: screenWidth > 400 ? 18 : 16, 
                      height: screenWidth > 400 ? 18 : 16, 
                      borderRadius: screenWidth > 400 ? 9 : 8, 
                      backgroundColor: category.color, 
                      marginRight: 12,
                      borderWidth: 1,
                      borderColor: colors.cardBorder
                    }}
                  />
                  <Text style={{ 
                    flex: 1, 
                    fontSize: screenWidth > 400 ? 16 : 14,
                    color: colors.textPrimary
                  }}>
                    {category.name}
                  </Text>
                  <Text style={{ 
                    fontWeight: 'bold', 
                    fontSize: screenWidth > 400 ? 16 : 14, 
                    color: colors.textPrimary 
                  }}>
                    {category.amount.toLocaleString()} ₽
                  </Text>
                </View>
              ))}
            </View>
          )}
          
          {categories.length === 0 && (
            <View style={{ marginTop: 40, alignItems: 'center' }}>
              <ThemedText style={{ 
                fontSize: screenWidth > 400 ? 18 : 16, 
                color: colors.textSecondary, 
                textAlign: 'center' 
              }}>
                {t('noDataToDisplay')}
              </ThemedText>
              <ThemedText style={{ 
                fontSize: screenWidth > 400 ? 16 : 14, 
                color: colors.textTertiary, 
                textAlign: 'center', 
                marginTop: 8 
              }}>
                {t('createCategoriesInExplore')}
              </ThemedText>
            </View>
          )}
        </ScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
