import { useCategories } from '@/components/CategoriesContext';
import { SpeedometerDiagram } from '@/components/SpeedometerDiagram';
import { ThemedText } from '@/components/ThemedText';
import React from 'react';
import { View } from 'react-native';

export default function HomeScreen() {
  const { categories } = useCategories();
  return (
    <View className="flex-1 items-center justify-center p-4" style={{ width: '100%' }}>
      <ThemedText>Hello</ThemedText>
      <SpeedometerDiagram categories={categories} size={260} />
    </View>
  );
}
