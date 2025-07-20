import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useLanguage } from '@/hooks/useLanguage';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface LanguageSwitcherProps {
  style?: any;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ style }) => {
  const { language, changeLanguage, t } = useLanguage();
  const colorScheme = useColorScheme();
  const theme = colorScheme ?? 'light';
  const colors = Colors[theme];

  const handleLanguageChange = async () => {
    const newLanguage = language === 'ru' ? 'en' : 'ru';
    await changeLanguage(newLanguage);
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>
        {t('language')}:
      </Text>
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: colors.buttonPrimary,
            borderColor: colors.cardBorder,
          }
        ]}
        onPress={handleLanguageChange}
      >
        <Text style={[styles.buttonText, { color: colors.buttonText }]}>
          {language === 'ru' ? t('russian') : t('english')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginRight: 12,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 80,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
}); 