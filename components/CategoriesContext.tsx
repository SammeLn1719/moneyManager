import React, { createContext, ReactNode, useContext, useState } from 'react';
import { Category } from './CategoryManager';

const defaultCategories: Category[] = [
  { name: 'Еда', amount: 500, color: '#4f8cff' },
  { name: 'Транспорт', amount: 4200, color: '#ffb347' },
  { name: 'Развлечения', amount: 1100, color: '#34d399' },
  { name: 'Секс', amount: 1100, color: '#ffffff' },
];

interface CategoriesContextType {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

export const CategoriesProvider = ({ children }: { children: ReactNode }) => {
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  return (
    <CategoriesContext.Provider value={{ categories, setCategories }}>
      {children}
    </CategoriesContext.Provider>
  );
};

export function useCategories() {
  const ctx = useContext(CategoriesContext);
  if (!ctx) throw new Error('useCategories must be used within a CategoriesProvider');
  return ctx;
} 