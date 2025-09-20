import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useState, useCallback } from 'react';
import { User, Settings, Crown, ChevronRight, TrendingUp, Calendar, DollarSign, Moon, Sun } from 'lucide-react-native';
import { Switch } from 'react-native';
import { BlurView } from 'expo-blur';
import { usePremium } from '../../contexts/PremiumContext';
import { router } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import { useTransactions, useSubscriptions, useBalance } from '../../hooks/useData';
import { useFocusEffect } from '@react-navigation/native';
import { Alert } from 'react-native';
import { formatCurrency } from '../../utils/storage';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileScreen() {
  const { isPremium, cancelSubscription } = usePremium();
  const { theme, isDark, toggleTheme } = useTheme();
  const { transactions, refreshTransactions } = useTransactions();
  const { subscriptions, refreshSubscriptions } = useSubscriptions();
  const { balance, refreshBalance } = useBalance();

  // Calculate real stats
  const calculateDaysActive = () => {
    if (transactions.length === 0) return 0;
    
    const uniqueDays = new Set();
    transactions.forEach(transaction => {
      const date = new Date(transaction.date).toDateString();
      uniqueDays.add(date);
    });
    
    return uniqueDays.size;
  };

  const calculateTotalTracked = () => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return totalIncome + totalExpenses;
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000000) {
      return `$${(amount / 1000000000).toFixed(1)}B`;
    }
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    }
    return `$${amount.toFixed(0)}`;
  };

  const daysActive = calculateDaysActive();
  const totalTracked = calculateTotalTracked();

  const handleCancelSubscription = () => {
    // For testing - immediately cancel subscription
    cancelSubscription().then(() => {
      Alert.alert(
        'Subscription Cancelled',
        'Your Premium subscription has been cancelled. You now have access to free features only.',
        [{ text: 'OK' }]
      );
    }).catch((error) => {
      console.error('Error cancelling subscription:', error);
      Alert.alert('Error', 'Failed to cancel subscription. Please try again.');
    });
  };

  const premiumFeatures = [
    'AI Financial Assistant & Predictions',
    'Investment & Portfolio Tracking',
    'Advanced Analytics & Forecasting',
    'Smart Notifications & Price Alerts',
    'Bank-Level Security & Cloud Sync',
    'Premium Support & Early Access'
  ];

  useFocusEffect(
    useCallback(() => {
      refreshTransactions();
      refreshSubscriptions();
      refreshBalance();
    }, [refreshTransactions, refreshSubscriptions, refreshBalance])
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <LinearGradient
        colors={isDark ? ['#0F0F23', '#1A1A2E', '#16213E'] : ['#F8FAFC', '#E2E8F0', '#CBD5E1']}
        style={styles.backgroundGradient}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Profile Card */}
        <View style={styles.heroSection}>
          <View style={styles.headerContent}>
            <Text style={[styles.title, { color: theme.colors.text }]}>Profile</Text>
            {isPremium && (
              <BlurView intensity={40} tint={isDark ? 'dark' : 'light'} style={styles.premiumBadge}>
                <Crown size={16} color="#F59E0B" />
                <Text style={styles.premiumText}>Premium</Text>
              </BlurView>
            )}
          </View>
          
          <BlurView intensity={100} tint={isDark ? 'dark' : 'light'} style={styles.profileCard}>
            <LinearGradient
              colors={isDark 
                ? ['rgba(26, 26, 46, 0.9)', 'rgba(22, 33, 62, 0.7)'] 
                : ['rgba(59, 130, 246, 0.05)', 'rgba(245, 158, 11, 0.02)']}
              style={styles.profileGradient}
            />
            <View style={styles.profileContent}>
                      <Edit3 size={18} color={theme.colors.primary} />
                <View style={[styles.avatar, { backgroundColor: `${theme.colors.primary}20` }]}>
                  <User size={32} color="#34D399" />
              <TouchableOpacity onPress={() => setShowNameModal(true)}>
                <Text style={[styles.profileName, { color: theme.colors.text }]}>
                  {userName ? `Hello, ${userName}!` : 'Welcome to Moni'}
                </Text>
                {!userName && (
                  <Text style={[styles.tapToAddName, { color: theme.colors.textSecondary }]}>
                    Tap to add your name
                  </Text>
                )}
              </TouchableOpacity>
              <Text style={[styles.profileSubtitle, { color: theme.colors.textSecondary }]}>Your financial companion</Text>
            </View>
          </BlurView>
        </View>

        {/* Stats Grid with Enhanced Glass */}
        <View style={styles.statsSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Your Journey</Text>
          
          <View style={styles.statsGrid}>
            <BlurView intensity={70} tint={isDark ? 'dark' : 'light'} style={styles.statCard}>
              <LinearGradient
                colors={isDark 
                  ? ['rgba(26, 26, 46, 0.8)', 'rgba(22, 33, 62, 0.6)'] 
                  : ['rgba(255, 255, 255, 0.8)', 'rgba(248, 250, 252, 0.6)']}
                style={styles.statCardGradient}
              />
              <View style={styles.statContent}>
                <View style={[styles.statIconContainer, { backgroundColor: `${theme.colors.primary}20` }]}>
                  <Calendar size={20} color={theme.colors.primary} />
                </View>
                <Text style={[styles.statNumber, { color: theme.colors.text }]}>{daysActive}</Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Days Active</Text>
              </View>
            </BlurView>

            <BlurView intensity={70} tint={isDark ? 'dark' : 'light'} style={styles.statCard}>
              <LinearGradient
                colors={isDark 
                  ? ['rgba(26, 26, 46, 0.8)', 'rgba(22, 33, 62, 0.6)'] 
                  : ['rgba(255, 255, 255, 0.8)', 'rgba(248, 250, 252, 0.6)']}
                style={styles.statCardGradient}
              />
              <View style={styles.statContent}>
                <View style={[styles.statIconContainer, { backgroundColor: `${theme.colors.success}20` }]}>
                  <TrendingUp size={20} color={theme.colors.success} />
                </View>
                <Text style={[styles.statNumber, { color: theme.colors.text }]}>{transactions.length}</Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Transactions</Text>
              </View>
            </BlurView>

            <BlurView intensity={70} tint={isDark ? 'dark' : 'light'} style={styles.statCard}>
              <LinearGradient
                colors={isDark 
                  ? ['rgba(26, 26, 46, 0.8)', 'rgba(22, 33, 62, 0.6)'] 
                  : ['rgba(255, 255, 255, 0.8)', 'rgba(248, 250, 252, 0.6)']}
                style={styles.statCardGradient}
              />
              <View style={styles.statContent}>
                <View style={[styles.statIconContainer, { backgroundColor: `${theme.colors.warning}20` }]}>
                  <Crown size={20} color={theme.colors.warning} />
                </View>
                <Text style={[styles.statNumber, { color: theme.colors.text }]}>{subscriptions.length}</Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Subscriptions</Text>
              </View>
            </BlurView>

            <BlurView intensity={70} tint={isDark ? 'dark' : 'light'} style={styles.statCard}>
              <LinearGradient
                colors={isDark 
                  ? ['rgba(26, 26, 46, 0.8)', 'rgba(22, 33, 62, 0.6)'] 
                  : ['rgba(255, 255, 255, 0.8)', 'rgba(248, 250, 252, 0.6)']}
                style={styles.statCardGradient}
              />
              <View style={styles.statContent}>
                <View style={[styles.statIconContainer, { backgroundColor: `${theme.colors.primary}20` }]}>
                  <DollarSign size={20} color={theme.colors.primary} />
                </View>
                <Text style={[styles.statNumber, { color: theme.colors.text }]}>{formatCurrency(totalTracked)}</Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Tracked</Text>
              </View>
            </BlurView>
          </View>
        </View>

        {/* Premium Section */}
        {!isPremium && (
          <View style={styles.premiumSection}>
            <BlurView intensity={80} tint={isDark ? 'dark' : 'light'} style={styles.premiumCard}>
              <LinearGradient
                colors={isDark 
                  ? ['rgba(26, 26, 46, 0.9)', 'rgba(22, 33, 62, 0.7)'] 
                  : ['rgba(245, 158, 11, 0.1)', 'rgba(245, 158, 11, 0.05)']}
                style={styles.premiumGradient}
              />
              <View style={styles.premiumContent}>
                <View style={styles.premiumHeader}>
                  <BlurView intensity={40} tint={isDark ? 'dark' : 'light'} style={styles.crownContainer}>
                    <Crown size={24} color="#F59E0B" />
                  </BlurView>
                  <Text style={[styles.premiumTitle, { color: theme.colors.text }]}>Upgrade to Premium</Text>
                </View>
                <Text style={[styles.premiumDescription, { color: theme.colors.textSecondary }]}>
                  Transform your financial life with AI-powered insights and advanced tools
                </Text>
                
                <View style={styles.featuresList}>
                  {premiumFeatures.slice(0, 3).map((feature, index) => (
                    <View key={index} style={styles.featureItem}>
                      <View style={styles.featureDot} />
                      <Text style={[styles.featureText, { color: theme.colors.text }]}>{feature}</Text>
                    </View>
                  ))}
                </View>

                <BlurView intensity={60} tint={isDark ? 'dark' : 'light'} style={styles.upgradeButton}>
                  <TouchableOpacity 
                    style={styles.upgradeButtonContent}
                    onPress={() => router.push('/paywall')}
                  >
                    <LinearGradient
                      colors={['#F59E0B', '#D97706']}
                      style={styles.upgradeGradient}
                    />
                    <Crown size={18} color="#FFFFFF" />
                    <Text style={styles.upgradeButtonText}>Upgrade Now</Text>
                    <Text style={styles.upgradePrice}>$4.99/mo</Text>
                  </TouchableOpacity>
                </BlurView>
              </View>
            </BlurView>
          </View>
        )}

        {/* Premium Management Section - Only show if user has premium */}
        {isPremium && (
          <View style={styles.premiumManagementSection}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Premium Subscription</Text>
            
            <BlurView intensity={70} tint={isDark ? 'dark' : 'light'} style={styles.premiumStatusCard}>
              <LinearGradient
                colors={isDark 
                  ? ['rgba(26, 26, 46, 0.8)', 'rgba(22, 33, 62, 0.6)'] 
                  : ['rgba(245, 158, 11, 0.1)', 'rgba(245, 158, 11, 0.05)']}
                style={styles.premiumStatusGradient}
              />
              <View style={styles.premiumStatusContent}>
                <View style={styles.premiumStatusHeader}>
                  <BlurView intensity={40} tint={isDark ? 'dark' : 'light'} style={styles.crownContainer}>
                    <Crown size={20} color="#F59E0B" />
                  </BlurView>
                  <View style={styles.premiumStatusInfo}>
                    <Text style={[styles.premiumStatusTitle, { color: theme.colors.text }]}>Premium Active</Text>
                    <Text style={[styles.premiumStatusDescription, { color: theme.colors.textSecondary }]}>
                      Enjoying all premium features
                    </Text>
                  </View>
                </View>
              </View>
            </BlurView>

            <BlurView intensity={60} tint={isDark ? 'dark' : 'light'} style={styles.cancelSubscriptionCard}>
              <LinearGradient
                colors={isDark 
                  ? ['rgba(26, 26, 46, 0.8)', 'rgba(22, 33, 62, 0.6)'] 
                  : ['rgba(239, 68, 68, 0.1)', 'rgba(239, 68, 68, 0.05)']}
                style={styles.cancelSubscriptionGradient}
              />
              <TouchableOpacity 
                style={styles.cancelSubscriptionContent}
                onPress={() => handleCancelSubscription()}
              >
                <View style={styles.cancelSubscriptionLeft}>
                  <BlurView intensity={40} tint={isDark ? 'dark' : 'light'} style={styles.cancelIconContainer}>
                    <Crown size={20} color={theme.colors.error} />
                  </BlurView>
                  <View style={styles.cancelSubscriptionInfo}>
                    <Text style={[styles.cancelSubscriptionTitle, { color: theme.colors.error }]}>
                      Cancel Subscription
                    </Text>
                    <Text style={[styles.cancelSubscriptionDescription, { color: theme.colors.textSecondary }]}>
                      Return to free plan
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </BlurView>
          </View>
        )}

        {/* Settings */}
        <View style={styles.settingsSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Preferences</Text>
          
          <BlurView intensity={60} tint={isDark ? 'dark' : 'light'} style={styles.settingCard}>
            <LinearGradient
              colors={isDark 
                ? ['rgba(26, 26, 46, 0.8)', 'rgba(22, 33, 62, 0.6)'] 
                : ['rgba(255, 255, 255, 0.8)', 'rgba(248, 250, 252, 0.6)']}
              style={styles.settingCardGradient}
            />
            <View style={styles.settingContent}>
              <View style={styles.settingLeft}>
                <BlurView intensity={40} tint={isDark ? 'dark' : 'light'} style={styles.settingIconContainer}>
                  {isDark ? (
                    <Moon size={20} color={theme.colors.textSecondary} />
                  ) : (
                    <Sun size={20} color={theme.colors.textSecondary} />
                  )}
                </BlurView>
                <Text style={[styles.settingText, { color: theme.colors.text }]}>Dark Mode</Text>
              </View>
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>
          </BlurView>
          
          <BlurView intensity={60} tint={isDark ? 'dark' : 'light'} style={styles.settingCard}>
            <LinearGradient
              colors={isDark 
                ? ['rgba(26, 26, 46, 0.8)', 'rgba(22, 33, 62, 0.6)'] 
                : ['rgba(255, 255, 255, 0.8)', 'rgba(248, 250, 252, 0.6)']}
              style={styles.settingCardGradient}
            />
            <TouchableOpacity 
              style={styles.settingContent}
              onPress={() => router.push('/settings')}
            >
              <View style={styles.settingLeft}>
                <BlurView intensity={40} tint={isDark ? 'dark' : 'light'} style={styles.settingIconContainer}>
                  <Settings size={20} color={theme.colors.textSecondary} />
                </BlurView>
                <Text style={[styles.settingText, { color: theme.colors.text }]}>More Settings</Text>
              </View>
              <ChevronRight size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </BlurView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  scrollView: {
    flex: 1,
  },
  headerBlur: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
    borderWidth: 0.5,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    overflow: 'hidden',
  },
  premiumText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F59E0B',
  },
  heroSection: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 32,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  profileCard: {
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 32,
    elevation: 12,
  },
  profileGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  profileContent: {
    padding: 40,
    alignItems: 'center',
  },
  avatarContainer: {
    borderRadius: 36,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    position: 'relative',
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editNameButton: {
    position: 'absolute', 
    bottom: -6,
    right: -6,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.4)',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  editNameButtonContent: {
    padding: 10,
  },
  profileName: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  tapToAddName: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
    fontStyle: 'italic',
  },
  profileSubtitle: {
    fontSize: 15,
    fontWeight: '600',
    opacity: 0.8,
    letterSpacing: 0.2,
  },
  statsSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  statCardGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  statContent: {
    padding: 20,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  premiumSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  premiumCard: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },
  premiumGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  premiumContent: {
    padding: 24,
  },
  premiumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  crownContainer: {
    padding: 8,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  premiumTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  premiumDescription: {
    fontSize: 16,
    marginBottom: 20,
    lineHeight: 24,
  },
  featuresList: {
    gap: 12,
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F59E0B',
  },
  featureText: {
    fontSize: 14,
    fontWeight: '500',
  },
  upgradeButton: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  upgradeButtonContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  upgradeGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  upgradeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
    marginLeft: 8,
  },
  upgradePrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  premiumManagementSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  premiumStatusCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  premiumStatusGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  premiumStatusContent: {
    padding: 20,
  },
  premiumStatusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  premiumStatusInfo: {
    flex: 1,
  },
  premiumStatusTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
  },
  premiumStatusDescription: {
    fontSize: 14,
  },
  cancelSubscriptionCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  cancelSubscriptionGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cancelSubscriptionContent: {
    padding: 20,
  },
  cancelSubscriptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  cancelIconContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  cancelSubscriptionInfo: {
    flex: 1,
  },
  cancelSubscriptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
  },
  cancelSubscriptionDescription: {
    fontSize: 14,
  },
  settingsSection: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  settingCard: {
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  settingCardGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  settingContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  settingIconContainer: {
    padding: 8,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  settingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  nameModalContent: {
    borderRadius: 24,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.2,
    shadowRadius: 32,
    elevation: 16,
  },
  nameModalGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  nameModalHeader: {
    padding: 24,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  nameModalTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  nameModalForm: {
    padding: 24,
  },
  nameInputContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  nameInput: {
    padding: 16,
    fontSize: 16,
    textAlign: 'center',
  },
  nameModalButtons: {
    flexDirection: 'row',
    padding: 24,
    gap: 16,
  },
  nameModalButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  nameModalButtonContent: {
    padding: 16,
    alignItems: 'center',
  },
  nameModalButtonGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  nameModalButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  nameModalButtonTextPrimary: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});