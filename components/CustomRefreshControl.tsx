import { RefreshControl, Platform } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface CustomRefreshControlProps {
  refreshing: boolean;
  onRefresh: () => void;
}

export function CustomRefreshControl({ refreshing, onRefresh }: CustomRefreshControlProps) {
  const { theme, isDark } = useTheme();

  return (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor={theme.colors.primary}
      colors={[theme.colors.primary]}
      progressBackgroundColor={isDark ? '#1F2937' : '#FFFFFF'}
      {...(Platform.OS === 'ios' && {
        title: refreshing ? 'Refreshing...' : 'Pull to refresh',
        titleColor: theme.colors.textSecondary,
      })}
    />
  );
}
