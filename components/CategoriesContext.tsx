import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Category } from './CategoryManager';

const STORAGE_KEY = '@moneyManager_categories';

const defaultCategories: Category[] = [
  { name: 'Еда', amount: 500, color: '#4f8cff' },
  { name: 'Транспорт', amount: 4200, color: '#ffb347' },
  { name: 'Развлечения', amount: 1100, color: '#34d399' },
  { name: 'Прочее', amount: 1200, color: '#22d3ee' },
];

interface CategoriesContextType {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  isLoading: boolean;
  resetToDefaults: () => Promise<void>;
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

export const CategoriesProvider = ({ children }: { children: ReactNode }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  
  useEffect(() => {
    loadCategories();
  }, []);

  
  useEffect(() => {
    if (!isLoading) {
      saveCategories(categories);
    }
  }, [categories, isLoading]);

  const loadCategories = async () => {
    try {
      const savedCategories = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedCategories) {
        const parsedCategories = JSON.parse(savedCategories);
        setCategories(parsedCategories);
      } else {
        
        setCategories(defaultCategories);
    
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(defaultCategories));
      }
    } catch (error) {
      console.error('Ошибка при загрузке категорий:', error);
      
      setCategories(defaultCategories);
    } finally {
      setIsLoading(false);
    }
  };

  const saveCategories = async (categoriesToSave: Category[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(categoriesToSave));
    } catch (error) {
      console.error('Ошибка при сохранении категорий:', error);
    }
  };

  const resetToDefaults = async () => {
    try {
      setCategories(defaultCategories);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(defaultCategories));
    } catch (error) {
      console.error('Ошибка при сбросе к значениям по умолчанию:', error);
    }
  };

  return (
    <CategoriesContext.Provider value={{ categories, setCategories, isLoading, resetToDefaults }}>
      {children}
    </CategoriesContext.Provider>
  );
};

export function useCategories() {
  const ctx = useContext(CategoriesContext);
  if (!ctx) throw new Error('useCategories must be used within a CategoriesProvider');
  return ctx;
} 