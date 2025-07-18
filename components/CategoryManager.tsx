import React, { useState } from 'react';
import { FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';

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
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [color, setColor] = useState(COLOR_PALETTE[0]);

  const addCategory = () => {
    if (!name.trim() || !amount.trim() || isNaN(Number(amount)) || Number(amount) <= 0) return;
    if (value.length >= 20) return;
    onChange([...value, { name, amount: Number(amount), color }]);
    setName('');
    setAmount('');
    setColor(COLOR_PALETTE[0]);
  };

  const removeCategory = (idx: number) => {
    const updated = value.filter((_, i) => i !== idx);
    onChange(updated);
  };

  return (
    <View style={{ width: '100%', marginBottom: 24 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 22, marginBottom: 12, textAlign: 'center' }}>Категории расходов</Text>
      <View style={{ backgroundColor: '#f3f4f6', borderRadius: 12, padding: 12, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          <TextInput
            placeholder="Название"
            value={name}
            onChangeText={setName}
            style={{ borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 8, flex: 1, marginRight: 8, backgroundColor: 'white' }}
          />
          <TextInput
            placeholder="Сумма"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            style={{ borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 8, width: 90, marginRight: 8, backgroundColor: 'white' }}
          />
          <FlatList
            data={COLOR_PALETTE}
            horizontal
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setColor(item)}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: item,
                  marginHorizontal: 2,
                  borderWidth: color === item ? 3 : 1,
                  borderColor: color === item ? '#222' : '#e5e7eb',
                  shadowColor: color === item ? '#222' : undefined,
                  shadowOpacity: color === item ? 0.2 : 0,
                  shadowRadius: color === item ? 4 : 0,
                }}
              />
            )}
            style={{ maxHeight: 36, marginRight: 8 }}
            showsHorizontalScrollIndicator={false}
          />
          <TouchableOpacity
            onPress={addCategory}
            style={{ backgroundColor: '#4f8cff', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 }}
            disabled={value.length >= 20}
          >
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Добавить</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 8, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 2 }}>
        {value.length === 0 && (
          <Text style={{ textAlign: 'center', color: '#9ca3af', marginVertical: 12 }}>Нет категорий</Text>
        )}
        {value.map((cat, idx) => (
          <View
            key={cat.name + idx}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 10,
              borderBottomWidth: idx !== value.length - 1 ? 1 : 0,
              borderColor: '#f3f4f6',
            }}
          >
            <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: cat.color, marginRight: 12, borderWidth: 2, borderColor: '#e5e7eb' }} />
            <Text style={{ flex: 1, fontSize: 16 }}>{cat.name}</Text>
            <Text style={{ fontWeight: 'bold', fontSize: 16, marginRight: 8 }}>{cat.amount}</Text>
            <TouchableOpacity onPress={() => removeCategory(idx)}>
              <Text style={{ color: '#e11d48', fontWeight: 'bold', fontSize: 15, marginLeft: 8 }}>Удалить</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
}; 