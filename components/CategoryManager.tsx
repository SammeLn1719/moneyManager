import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { subscribeToLanguageChange, useLanguage } from '@/hooks/useLanguage';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, FlatList, Keyboard, Modal, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const COLOR_PALETTE = [
  '#4f8cff', '#ffb347', '#34d399', '#f87171', '#a78bfa', '#fbbf24', '#f472b6', '#60a5fa', '#facc15', '#10b981',
  '#e11d48', '#6366f1', '#f59e42', '#22d3ee', '#c026d3', '#84cc16', '#f43f5e', '#0ea5e9', '#fde68a', '#a3e635',
];

export interface Category {
  name: string;
  amount: number;
  color: string;
}

interface CategoryManagerProps {
  value: Category[];
  onChange: (categories: Category[]) => void;
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({ value, onChange }) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme ?? 'light';
  const colors = Colors[theme];
  const { t, tWithParams } = useLanguage();
  const [updateKey, setUpdateKey] = useState(0);
  
  // Подписываемся на изменения языка
  useEffect(() => {
    const unsubscribe = subscribeToLanguageChange(() => {
      setUpdateKey(prev => prev + 1);
    });
    
    return unsubscribe;
  }, []);
  
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [color, setColor] = useState(COLOR_PALETTE[0]);
  
  // Состояние для редактирования
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editColor, setEditColor] = useState(COLOR_PALETTE[0]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  
  // Состояние для добавления новой категории
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  const addCategory = () => {
    if (!name.trim()) return;
    if (value.length >= 20) return;
    
    // Проверяем, не существует ли уже категория с таким именем
    const existingCategory = value.find(cat => cat.name.toLowerCase().trim() === name.toLowerCase().trim());
    if (existingCategory) {
      Alert.alert(
        t('categoryExists'),
        tWithParams('categoryExistsMessage', { name: name }),
        [{ text: 'OK' }]
      );
      return;
    }
    
    // Если сумма не указана или некорректная, устанавливаем 0
    const categoryAmount = amount.trim() && !isNaN(Number(amount)) && Number(amount) >= 0 
      ? Number(amount) 
      : 0;
    
    onChange([...value, { name: name.trim(), amount: categoryAmount, color }]);
    
    // Показываем уведомление об успешном добавлении
    Alert.alert(
      t('categoryAdded'),
      tWithParams('categoryAddedMessage', { name: name.trim() }),
      [{ text: 'OK' }]
    );
    
    // Сброс формы
    setName('');
    setAmount('');
    setColor(COLOR_PALETTE[0]);
    setIsAddModalVisible(false);
  };

  const openAddModal = () => {
    if (value.length >= 20) {
      Alert.alert(
        t('limitReached'),
        t('maxCategoriesMessage'),
        [{ text: 'OK' }]
      );
      return;
    }
    setIsAddModalVisible(true);
  };

  const closeAddModal = () => {
    setName('');
    setAmount('');
    setColor(COLOR_PALETTE[0]);
    setIsAddModalVisible(false);
  };

  const removeCategory = (idx: number) => {
    Alert.alert(
      t('categoryDeleted'),
      tWithParams('categoryDeletedMessage', { name: value[idx].name }),
      [
        { text: t('cancel'), style: 'cancel' },
        { 
          text: t('delete'), 
          style: 'destructive',
          onPress: () => {
            const updated = value.filter((_, i) => i !== idx);
            onChange(updated);
          }
        }
      ]
    );
  };

  const startEditing = (idx: number) => {
    const category = value[idx];
    setEditingIndex(idx);
    setEditName(category.name);
    setEditAmount(category.amount.toString());
    setEditColor(category.color);
    setIsEditModalVisible(true);
  };

  const openEditModal = (idx: number) => {
    setEditingIndex(idx);
    setEditName(value[idx].name);
    setEditAmount(value[idx].amount.toString());
    setEditColor(value[idx].color);
    setIsEditModalVisible(true);
  };

  const saveEdit = () => {
    if (!editName.trim() || editingIndex === null) return;
    
    // Проверяем, не существует ли уже категория с таким именем (кроме текущей)
    const existingCategory = value.find((cat, i) => 
      i !== editingIndex && cat.name.toLowerCase().trim() === editName.toLowerCase().trim()
    );
    if (existingCategory) {
      Alert.alert(
        t('categoryExists'),
        tWithParams('categoryExistsMessage', { name: editName }),
        [{ text: 'OK' }]
      );
      return;
    }
    
    // Если сумма не указана или некорректная, устанавливаем 0
    const categoryAmount = editAmount.trim() && !isNaN(Number(editAmount)) && Number(editAmount) >= 0 
      ? Number(editAmount) 
      : 0;
    
    const updated = [...value];
    updated[editingIndex] = { 
      name: editName.trim(), 
      amount: categoryAmount, 
      color: editColor 
    };
    onChange(updated);
    
    // Сброс формы
    setEditName('');
    setEditAmount('');
    setEditColor(COLOR_PALETTE[0]);
    setEditingIndex(null);
    setIsEditModalVisible(false);
  };

  const closeEditModal = () => {
    setEditName('');
    setEditAmount('');
    setEditColor(COLOR_PALETTE[0]);
    setEditingIndex(null);
    setIsEditModalVisible(false);
  };

  const renderCategoryItem = ({ item, index }: { item: Category; index: number }) => (
    <TouchableOpacity
      onPress={() => openEditModal(index)}
      style={{
        backgroundColor: colors.listItemBackground,
        paddingVertical: screenWidth > 400 ? 16 : 14,
        paddingHorizontal: screenWidth > 400 ? 20 : 16,
        marginBottom: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.cardBorder,
        shadowColor: colors.cardShadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View 
          style={{ 
            width: screenWidth > 400 ? 20 : 18, 
            height: screenWidth > 400 ? 20 : 18, 
            borderRadius: screenWidth > 400 ? 10 : 9, 
            backgroundColor: item.color, 
            marginRight: 12,
            borderWidth: 1,
            borderColor: colors.cardBorder
          }}
        />
        <View style={{ flex: 1 }}>
          <Text style={{ 
            fontSize: screenWidth > 400 ? 18 : 16, 
            fontWeight: '600', 
            color: colors.textPrimary,
            marginBottom: 4
          }}>
            {item.name}
          </Text>
          <Text style={{ 
            fontSize: screenWidth > 400 ? 16 : 14, 
            color: colors.textSecondary 
          }}>
            {item.amount.toLocaleString()} ₽
          </Text>
        </View>
        <TouchableOpacity 
          onPress={(e) => {
            e.stopPropagation();
            removeCategory(index);
          }}
          style={{
            backgroundColor: colors.danger,
            paddingHorizontal: screenWidth > 400 ? 12 : 10,
            paddingVertical: screenWidth > 400 ? 8 : 6,
            borderRadius: 8,
            marginLeft: 8,
            borderWidth: 1,
            borderColor: colors.danger,
          }}
        >
          <Text style={{ 
            color: colors.dangerText, 
            fontWeight: 'bold', 
            fontSize: screenWidth > 400 ? 14 : 12
          }}>
            {t('delete')}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View key={updateKey} style={{ flex: 1 }}>
      <Text style={{ 
        fontSize: screenWidth > 400 ? 16 : 14, 
        color: colors.textSecondary, 
        marginBottom: 16, 
        textAlign: 'center' 
      }}>
        {t('clickToEditAndDelete')}
      </Text>
      
      {value.length > 0 ? (
        <FlatList
          data={value}
          renderItem={renderCategoryItem}
          keyExtractor={(_, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      ) : (
        <View style={{ 
          flex: 1, 
          justifyContent: 'center', 
          alignItems: 'center',
          paddingVertical: 40
        }}>
          <Text style={{ 
            fontSize: screenWidth > 400 ? 18 : 16, 
            color: colors.textSecondary, 
            textAlign: 'center' 
          }}>
            {t('noCategories')}
          </Text>
        </View>
      )}
      
      <TouchableOpacity
        onPress={openAddModal}
        style={{
          backgroundColor: colors.buttonPrimary,
          paddingVertical: screenWidth > 400 ? 16 : 14,
          paddingHorizontal: screenWidth > 400 ? 24 : 20,
          borderRadius: 12,
          alignItems: 'center',
          marginTop: 16,
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
          {t('addCategory')}
        </Text>
      </TouchableOpacity>

        {/* Модальное окно для добавления категории */}
        <Modal
          visible={isAddModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={closeAddModal}
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
                  {t('addCategoryTitle')}
                </Text>
                
                <Text style={{ 
                  fontSize: screenWidth > 400 ? 16 : 14, 
                  marginBottom: 8, 
                  color: colors.textPrimary 
                }}>
                  {t('categoryName')}
                </Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder={t('categoryNamePlaceholder')}
                  placeholderTextColor={colors.textTertiary}
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
                  {t('amount')}
                </Text>
                <TextInput
                  value={amount}
                  onChangeText={setAmount}
                  placeholder={t('amountPlaceholder')}
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
                  {t('color')}
                </Text>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  style={{ marginBottom: 20 }}
                >
                  {COLOR_PALETTE.map((c) => (
                    <TouchableOpacity
                      key={c}
                      onPress={() => setColor(c)}
                      style={{
                        width: screenWidth > 400 ? 40 : 36,
                        height: screenWidth > 400 ? 40 : 36,
                        borderRadius: screenWidth > 400 ? 20 : 18,
                        backgroundColor: c,
                        marginRight: 8,
                        borderWidth: color === c ? 3 : 1,
                        borderColor: color === c ? colors.primary : colors.cardBorder,
                      }}
                    />
                  ))}
                </ScrollView>
                
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <TouchableOpacity
                    onPress={closeAddModal}
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
                    onPress={addCategory}
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

        {/* Модальное окно для редактирования */}
        <Modal
          visible={isEditModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={closeEditModal}
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
                  {t('editCategoryTitle')}
                </Text>
                
                <Text style={{ 
                  fontSize: screenWidth > 400 ? 16 : 14, 
                  marginBottom: 8, 
                  color: colors.textPrimary 
                }}>
                  {t('categoryName')}
                </Text>
                <TextInput
                  value={editName}
                  onChangeText={setEditName}
                  placeholder={t('categoryNamePlaceholder')}
                  placeholderTextColor={colors.textTertiary}
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
                  {t('amount')}
                </Text>
                <TextInput
                  value={editAmount}
                  onChangeText={setEditAmount}
                  placeholder={t('amountPlaceholder')}
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
                  {t('color')}
                </Text>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  style={{ marginBottom: 20 }}
                >
                  {COLOR_PALETTE.map((c) => (
                    <TouchableOpacity
                      key={c}
                      onPress={() => setEditColor(c)}
                      style={{
                        width: screenWidth > 400 ? 40 : 36,
                        height: screenWidth > 400 ? 40 : 36,
                        borderRadius: screenWidth > 400 ? 20 : 18,
                        backgroundColor: c,
                        marginRight: 8,
                        borderWidth: editColor === c ? 3 : 1,
                        borderColor: editColor === c ? colors.primary : colors.cardBorder,
                      }}
                    />
                  ))}
                </ScrollView>
                
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <TouchableOpacity
                    onPress={closeEditModal}
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
                    onPress={saveEdit}
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
                      {t('save')}
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