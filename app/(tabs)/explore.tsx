import "@/assets/css/global.css";
import { useCategories } from '@/components/CategoriesContext';
import { CategoryManager } from '@/components/CategoryManager';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function TabTwoScreen() {
  const { categories, setCategories } = useCategories();
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold text-blue-500">
        Welcome to Nativewind!
      </Text>
      <CategoryManager value={categories} onChange={setCategories} />
    </View>
  );
}

const styles = StyleSheet.create({
  
});
