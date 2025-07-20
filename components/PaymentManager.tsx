import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { subscribeToLanguageChange, useLanguage } from '@/hooks/useLanguage';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, Keyboard, Modal, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export interface Category {
  name: string;
  amount: number;
  color: string;
}

interface PaymentManagerProps {
  categories: Category[];
  onPaymentAdd: (categoryIndex: number, amount: number) => void;
}

export const PaymentManager: React.FC<PaymentManagerProps> = ({ categories, onPaymentAdd }) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme ?? 'light';
  const colors = Colors[theme];
  const { t, tWithParams } = useLanguage();
  const [updateKey, setUpdateKey] = useState(0);
  
  
  useEffect(() => {
    const unsubscribe = subscribeToLanguageChange(() => {
      setUpdateKey(prev => prev + 1);
    });
    
    return unsubscribe;
  }, []);
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number | null>(null);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const openModal = () => {
    if (categories.length === 0) {
      Alert.alert(
        t('noCategoriesError'),
        t('noCategoriesMessage'),
        [{ text: 'OK' }]
      );
      return;
    }
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setSelectedCategoryIndex(null);
    setAmount('');
    setDescription('');
    setIsModalVisible(false);
  };

  const addPayment = () => {
    if (selectedCategoryIndex === null) {
      Alert.alert(
        t('selectCategoryError'),
        t('selectCategoryMessage'),
        [{ text: 'OK' }]
      );
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert(
        t('invalidAmount'),
        t('invalidAmountMessage'),
        [{ text: 'OK' }]
      );
      return;
    }

    onPaymentAdd(selectedCategoryIndex, numAmount);
    
  
    Alert.alert(
      t('expenseAdded'),
      tWithParams('expenseAddedMessage', { 
        amount: numAmount.toLocaleString(), 
        category: categories[selectedCategoryIndex].name 
      }),
      [{ text: 'OK' }]
    );
    
    closeModal();
  };

  return (
    <View key={updateKey} style={{ width: '100%', marginBottom: 24 }}>
      <TouchableOpacity
        onPress={openModal}
        style={{
          backgroundColor: colors.buttonPrimary,
          paddingVertical: screenWidth > 400 ? 16 : 14,
          paddingHorizontal: screenWidth > 400 ? 24 : 20,
          borderRadius: 12,
          alignItems: 'center',
          shadowColor: colors.cardShadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
          borderWidth: 1,
          borderColor: colors.buttonBorder,
        }}
      >
        <Text style={{ 
          color: colors.buttonText, 
          fontWeight: 'bold', 
          fontSize: screenWidth > 400 ? 18 : 16 
        }}>
          {t('addExpense')}
        </Text>
      </TouchableOpacity>

     
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ 
            flex: 1, 
            backgroundColor: colors.modalOverlay, 
            justifyContent: 'center', 
            alignItems: 'center' 
          }}>
            <View style={{ 
              backgroundColor: colors.modalBackground, 
              borderRadius: 12, 
              padding: screenWidth > 400 ? 24 : 20, 
              width: screenWidth > 400 ? 400 : screenWidth - 40,
              borderWidth: 1,
              borderColor: colors.modalBorder,
            }}>
              <Text style={{ 
                fontSize: screenWidth > 400 ? 20 : 18, 
                fontWeight: 'bold', 
                marginBottom: 20, 
                textAlign: 'center',
                color: colors.textPrimary
              }}>
                {t('addExpense')}
              </Text>
              
              <Text style={{ 
                fontSize: screenWidth > 400 ? 16 : 14, 
                marginBottom: 8, 
                color: colors.textPrimary 
              }}>
                {t('selectCategory')}
              </Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={{ marginBottom: 16 }}
              >
                {categories.map((category, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setSelectedCategoryIndex(index)}
                    style={{
                      backgroundColor: selectedCategoryIndex === index ? colors.primary : colors.buttonSecondary,
                      paddingVertical: screenWidth > 400 ? 10 : 8,
                      paddingHorizontal: screenWidth > 400 ? 16 : 12,
                      borderRadius: 8,
                      marginRight: 8,
                      borderWidth: 1,
                      borderColor: selectedCategoryIndex === index ? colors.primary : colors.buttonBorder,
                    }}
                  >
                    <Text style={{ 
                      color: selectedCategoryIndex === index ? colors.primaryText : colors.buttonSecondaryText,
                      fontWeight: '600',
                      fontSize: screenWidth > 400 ? 14 : 12
                    }}>
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              
              <Text style={{ 
                fontSize: screenWidth > 400 ? 16 : 14, 
                marginBottom: 8, 
                color: colors.textPrimary 
              }}>
                {t('expenseAmount')}
              </Text>
              <TextInput
                value={amount}
                onChangeText={setAmount}
                placeholder={t('expenseAmountPlaceholder')}
                placeholderTextColor={colors.textTertiary}
                keyboardType="numeric"
                style={{ 
                  borderWidth: 1, 
                  borderColor: colors.inputBorder, 
                  borderRadius: 8, 
                  padding: screenWidth > 400 ? 12 : 10, 
                  marginBottom: 16,
                  fontSize: screenWidth > 400 ? 16 : 14,
                  backgroundColor: colors.inputBackground,
                  color: colors.textPrimary
                }}
              />
              
              <Text style={{ 
                fontSize: screenWidth > 400 ? 16 : 14, 
                marginBottom: 8, 
                color: colors.textPrimary 
              }}>
                {t('description')}
              </Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder={t('descriptionPlaceholder')}
                placeholderTextColor={colors.textTertiary}
                multiline
                numberOfLines={3}
                style={{ 
                  borderWidth: 1, 
                  borderColor: colors.inputBorder, 
                  borderRadius: 8, 
                  padding: screenWidth > 400 ? 12 : 10, 
                  marginBottom: 20,
                  fontSize: screenWidth > 400 ? 16 : 14,
                  backgroundColor: colors.inputBackground,
                  color: colors.textPrimary,
                  textAlignVertical: 'top'
                }}
              />
              
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity
                  onPress={closeModal}
                  style={{ 
                    backgroundColor: colors.buttonSecondary, 
                    paddingVertical: screenWidth > 400 ? 12 : 10, 
                    paddingHorizontal: screenWidth > 400 ? 20 : 16, 
                    borderRadius: 8, 
                    flex: 1, 
                    marginRight: 8,
                    borderWidth: 1,
                    borderColor: colors.buttonBorder,
                  }}
                >
                  <Text style={{ 
                    textAlign: 'center', 
                    fontWeight: 'bold', 
                    fontSize: screenWidth > 400 ? 16 : 14,
                    color: colors.buttonSecondaryText
                  }}>
                    {t('cancel')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={addPayment}
                  style={{ 
                    backgroundColor: colors.buttonPrimary, 
                    paddingVertical: screenWidth > 400 ? 12 : 10, 
                    paddingHorizontal: screenWidth > 400 ? 20 : 16, 
                    borderRadius: 8, 
                    flex: 1, 
                    marginLeft: 8,
                    borderWidth: 1,
                    borderColor: colors.buttonBorder,
                  }}
                >
                  <Text style={{ 
                    textAlign: 'center', 
                    fontWeight: 'bold', 
                    fontSize: screenWidth > 400 ? 16 : 14,
                    color: colors.buttonText
                  }}>
                    {t('add')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}; 