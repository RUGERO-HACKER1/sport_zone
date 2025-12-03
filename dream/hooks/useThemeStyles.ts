import { useTheme } from '../contexts/ThemeContext';

export const useThemeStyles = () => {
  const { colors, currentTheme } = useTheme();
  
  return {
    colors,
    currentTheme,
    // You can add common style combinations here
    cardStyle: {
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 16,
      marginVertical: 8,
    },
    headerStyle: {
      backgroundColor: colors.card,
      padding: 20,
    },
    textStyle: {
      color: colors.text,
    },
    textSecondaryStyle: {
      color: colors.textSecondary,
    },
  };
};