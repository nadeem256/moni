import { Tabs } from 'expo-router';
import { House, Plus, CreditCard, ChartBar as BarChart3, User } from 'lucide-react-native';
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
          paddingBottom: 16,
          paddingTop: 16,
          height: 95,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarBackground: () => (
          <BlurView intensity={120} tint="light" style={styles.tabBarBlur} />
        ),
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarShowLabel: false,
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ size, color }) => (
            <House size={size + 2} color={color} strokeWidth={2.2} />
          ),
        }}
      />
      <Tabs.Screen
        name="subscriptions"
        options={{
          tabBarIcon: ({ size, color }) => (
            <CreditCard size={size + 2} color={color} strokeWidth={2.2} />
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
            <Plus size={30} color="#FFFFFF" strokeWidth={3.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          tabBarIcon: ({ size, color }) => (
            <BarChart3 size={size + 2} color={color} strokeWidth={2.2} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ size, color }) => (
            <User size={size + 2} color={color} strokeWidth={2.2} />
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
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
  },
  customButton: {
    top: -24,
    justifyContent: 'center',
    alignItems: 'center',
    width: 76,
    height: 76,
  },
  customButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(59, 130, 246, 0.4)',
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  customButtonGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#3B82F6',
    borderRadius: 30,
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