import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { ArrowLeft, RotateCcw, Bell, Shield, Circle as HelpCircle, Download, Crown, ChevronRight } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../contexts/ThemeContext';
import { usePremium } from '../contexts/PremiumContext';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [biometrics, setBiometrics] = useState(false);
  const { theme, isDark } = useTheme();
  const { isPremium, cancelSubscription } = usePremium();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const notificationsValue = await AsyncStorage.getItem('notifications');
      const biometricsValue = await AsyncStorage.getItem('biometrics');
      setNotifications(notificationsValue !== 'false');
      setBiometrics(biometricsValue === 'true');
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleNotificationsToggle = async (value: boolean) => {
    try {
      setNotifications(value);
      await AsyncStorage.setItem('notifications', value.toString());
    } catch (error) {
      console.error('Error saving notifications setting:', error);
    }
  };

  const handleBiometricsToggle = async (value: boolean) => {
    try {
      setBiometrics(value);
      await AsyncStorage.setItem('biometrics', value.toString());
    } catch (error) {
      console.error('Error saving biometrics setting:', error);
    }
  };

  const handleExportData = () => {
    if (isPremium) {
      Alert.alert('Export Data', 'Data export feature coming soon!', [{ text: 'OK' }]);
    }
  };

  const handleHelp = () => {
    Alert.alert(
      'Help & Support',
      'For support, please contact us at support@moni.app or visit our website.',
      [{ text: 'OK' }]
    );
  };

  const handleCancelSubscription = () => {
    Alert.alert(
      'Cancel Premium Subscription',
      'Are you sure you want to cancel your Premium subscription? You will lose access to all premium features immediately.',
      [
        {
          text: 'Keep Premium',
          style: 'cancel',
        },
        {
          text: 'Cancel Subscription',
          style: 'destructive',
          onPress: async () => {
            try {
              await cancelSubscription();
              Alert.alert(
                'Subscription Cancelled',
                'Your Premium subscription has been cancelled. You now have access to free features only.',
                [{ text: 'OK' }]
              );
            } catch (error) {
              console.error('Error cancelling subscription:', error);
              Alert.alert('Error', 'Failed to cancel subscription. Please try again or contact support.');
            }
          },
        },
      ]
    );
  };

  const handleResetApp = () => {
    Alert.alert(
      'Reset App',
      'This will delete all your data including transactions, subscriptions, and settings. This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Are you sure?',
              'All your financial data will be permanently deleted.',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Delete Everything',
                  style: 'destructive',
                  onPress: performReset,
                },
              ]
            );
          },
        },
      ]
    );
  };

  const performReset = async () => {
    try {
      await AsyncStorage.multiRemove([
        'transactions',
        'subscriptions',
        'balance',
        'notifications',
        'biometrics',
        'isPremium',
        'hasCompletedOnboarding'
      ]);
      
      Alert.alert(
        'App Reset Complete',
        'All data has been cleared. The app will restart.',
        [
          {
            text: 'OK',
            onPress: () => {
              router.replace('/onboarding');
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error resetting app:', error);
      Alert.alert('Error', 'Failed to reset app. Please try again.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Notifications</Text>
          
          <View style={[styles.settingItem, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <View style={styles.settingLeft}>
              <Bell size={20} color={theme.colors.textSecondary} />
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: theme.colors.text }]}>Push Notifications</Text>
                <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>Get notified about renewals</Text>
              </View>
            </View>
            <Switch
              value={notifications}
              onValueChange={handleNotificationsToggle}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Security Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Security</Text>
          
          <View style={[styles.settingItem, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <View style={styles.settingLeft}>
              <Shield size={20} color={theme.colors.textSecondary} />
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: theme.colors.text }]}>Biometric Lock</Text>
                <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>Use Face ID or fingerprint</Text>
              </View>
            </View>
            <Switch
              value={biometrics}
              onValueChange={handleBiometricsToggle}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Data Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Data</Text>
          
          <TouchableOpacity 
            style={[styles.settingItem, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
            onPress={!isPremium ? () => router.push('/paywall') : handleExportData}
          >
            <View style={styles.settingLeft}>
              <Download size={20} color={theme.colors.textSecondary} />
              <View style={styles.settingInfo}>
                <Text style={[
                  styles.settingTitle, 
                  { color: !isPremium ? theme.colors.textSecondary : theme.colors.text }
                ]}>Export Data</Text>
                <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>Export your data to CSV</Text>
              </View>
            </View>
            {!isPremium ? (
              <View style={styles.premiumBadgeSmall}>
                <Crown size={14} color="#F59E0B" />
              </View>
            ) : (
              <ChevronRight size={20} color={theme.colors.textSecondary} />
            )}
          </TouchableOpacity>
        </View>

        {/* Subscription Section - Only show if user has premium */}

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Support</Text>
          
          <TouchableOpacity 
            style={[styles.settingItem, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]} 
            onPress={() => handleHelp()}
          >
            <View style={styles.settingLeft}>
              <HelpCircle size={20} color={theme.colors.textSecondary} />
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: theme.colors.text }]}>Help & Support</Text>
                <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>Get help or contact us</Text>
              </View>
            </View>
            <ChevronRight size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Danger Zone</Text>
          
          <TouchableOpacity 
            style={[styles.dangerItem, { backgroundColor: theme.colors.surface }]} 
            onPress={() => handleResetApp()}
          >
            <View style={styles.settingLeft}>
              <RotateCcw size={20} color={theme.colors.error} />
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: theme.colors.error }]}>Reset App</Text>
                <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>Delete all data and start fresh</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={[styles.appInfoText, { color: theme.colors.textSecondary }]}>Moni v1.0.0</Text>
          <Text style={[styles.appInfoSubtext, { color: theme.colors.textSecondary }]}>Made with ❤️ for better financial clarity</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    marginLeft: 4,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  dangerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 16,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
  },
  premiumBadgeSmall: {
    backgroundColor: '#FEF3C7',
    padding: 6,
    borderRadius: 12,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingBottom: 100,
  },
  appInfoText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  appInfoSubtext: {
    fontSize: 14,
  },
});