import { Tabs } from 'expo-router';
import { Hop as Home, Plus, CreditCard, ChartBar as BarChart3, User } from 'lucide-react-native';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';

function CustomTabBarButton({ children, onPress }: any) {
  const { theme } = useTheme();
  
  return (
    <TouchableOpacity
      style={styles.customButton}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <BlurView intensity={80} tint="light" style={styles.customButtonInner}>
        <View style={styles.customButtonGradient} />
        <View style={styles.iconContainer}>
          <Plus size={28} color="#FFFFFF" strokeWidth={3} />
        </View>
      </BlurView>
    </TouchableOpacity>
  );
}

export default function TabLayout() {
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          paddingBottom: 12,
          paddingTop: 12,
          height: 90,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarBackground: () => (
          <BlurView intensity={100} tint="light" style={styles.tabBarBlur} />
        ),
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarShowLabel: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ size, color }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="subscriptions"
        options={{
          tabBarIcon: ({ size, color }) => (
            <CreditCard size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          tabBarButton: (props) => (
            <CustomTabBarButton {...props} onPress={() => router.push('/add')} />
          ),
          tabBarIcon: ({ size, color }) => (
            <Plus size={28} color="#FFFFFF" strokeWidth={3} />
          ),
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          tabBarIcon: ({ size, color }) => (
            <BarChart3 size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ size, color }) => (
            <User size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarBlur: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  customButton: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: 70,
  },
  customButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    overflow: 'hidden',
    position: 'relative',
  },
  customButtonGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#3B82F6',
    borderRadius: 28,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1,
  },
  iconContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
});