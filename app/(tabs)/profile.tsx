import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Image, RefreshControl } from 'react-native';
import { useCallback, useState, useEffect } from 'react';
import { User, Settings, ChevronRight, TrendingUp, Calendar, DollarSign, Moon, Sun, Crown, Edit } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import { useTransactions, useSubscriptions, useBalance } from '../../hooks/useData';
import { useFocusEffect } from '@react-navigation/native';
import { formatCurrency } from '../../utils/storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../contexts/AuthContext';
import { getProfile, Profile } from '../../services/profileService';

export default function ProfileScreen() {
  const { theme, isDark, toggleTheme, canUseDarkMode } = useTheme();
  const [profile, setProfile] = useState<Profile | null>(null);
  const { transactions, refreshTransactions } = useTransactions();
  const { subscriptions, refreshSubscriptions } = useSubscriptions();
  const { balance, refreshBalance } = useBalance();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

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

  const premiumFeatures = [
    'AI Financial Assistant & Predictions',
    'Dark Mode & Premium Themes',
    'Investment & Portfolio Tracking',
    'Advanced Analytics & Forecasting',
    'Smart Notifications & Price Alerts',
    'Bank-Level Security & Cloud Sync',
    'Premium Support & Early Access'
  ];

  const loadProfile = async () => {
    if (!user?.id) return;
    const profileData = await getProfile(user.id);
    setProfile(profileData);
  };

  useEffect(() => {
    loadProfile();
  }, [user?.id]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      refreshTransactions(),
      refreshSubscriptions(),
      refreshBalance(),
      loadProfile()
    ]);
    setRefreshing(false);
  }, [refreshTransactions, refreshSubscriptions, refreshBalance]);

  useFocusEffect(
    useCallback(() => {
      refreshTransactions();
      refreshSubscriptions();
      refreshBalance();
      loadProfile();
    }, [refreshTransactions, refreshSubscriptions, refreshBalance])
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <LinearGradient
        colors={isDark ? ['#0A0B0F', '#12131A', '#0F1014'] : ['#F8FAFC', '#E2E8F0', '#CBD5E1']}
        style={styles.backgroundGradient}
      />
      
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
      >
        {/* Hero Profile Card */}
        <View style={styles.heroSection}>
          <View style={styles.headerContent}>
            <Text style={[styles.title, { color: theme.colors.text }]}>Profile</Text>
            <TouchableOpacity
              onPress={() => router.push('/edit-profile')}
              style={[styles.editButton, { backgroundColor: theme.colors.surface }]}
            >
              <Edit size={20} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
          
          <BlurView intensity={100} tint={isDark ? 'dark' : 'light'} style={styles.profileCard}>
            <LinearGradient
              colors={isDark
                ? ['rgba(22, 24, 33, 0.95)', 'rgba(59, 130, 246, 0.12)']
                : ['rgba(59, 130, 246, 0.05)', 'rgba(245, 158, 11, 0.02)']}
              style={styles.profileGradient}
            />
            <View style={styles.profileContent}>
              <BlurView intensity={60} tint={isDark ? 'dark' : 'light'} style={styles.avatarContainer}>
                {profile?.avatar_url ? (
                  <Image source={{ uri: profile.avatar_url }} style={styles.avatarImage} />
                ) : (
                  <View style={[styles.avatar, { backgroundColor: `${theme.colors.primary}20` }]}>
                    <User size={32} color={theme.colors.primary} />
                  </View>
                )}
              </BlurView>
              <Text style={[styles.profileName, { color: theme.colors.text }]}>
                {profile?.full_name || user?.user_metadata?.full_name || 'Welcome to Moni'}
              </Text>
              <Text style={[styles.profileSubtitle, { color: theme.colors.textSecondary }]}>
                {user?.email || 'Your financial companion'}
              </Text>
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
                  ? ['rgba(22, 24, 33, 0.9)', 'rgba(16, 18, 25, 0.8)']
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
                  ? ['rgba(22, 24, 33, 0.9)', 'rgba(16, 18, 25, 0.8)']
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
                  ? ['rgba(22, 24, 33, 0.9)', 'rgba(16, 18, 25, 0.8)']
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
                  ? ['rgba(22, 24, 33, 0.9)', 'rgba(16, 18, 25, 0.8)']
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

        {/* Settings */}
        <View style={styles.settingsSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Preferences</Text>
          
          <BlurView intensity={60} tint={isDark ? 'dark' : 'light'} style={styles.settingCard}>
            <LinearGradient
              colors={isDark
                ? ['rgba(22, 24, 33, 0.9)', 'rgba(16, 18, 25, 0.8)']
                : ['rgba(255, 255, 255, 0.8)', 'rgba(248, 250, 252, 0.6)']}
              style={styles.settingCardGradient}
            />
            <TouchableOpacity 
              style={styles.settingContent}
              onPress={toggleTheme}
            >
              <View style={styles.settingLeft}>
                <BlurView intensity={40} tint={isDark ? 'dark' : 'light'} style={styles.settingIconContainer}>
                  {isDark ? (
                    <Moon size={20} color={theme.colors.textSecondary} />
                  ) : (
                    <Sun size={20} color={theme.colors.textSecondary} />
                  )}
                </BlurView>
                <View style={styles.settingTextContainer}>
                  <Text style={[styles.settingText, { color: theme.colors.text }]}>
                    Dark Mode
                  </Text>
                </View>
              </View>
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                thumbColor="#FFFFFF"
              />
            </TouchableOpacity>
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
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 88,
    height: 88,
    borderRadius: 36,
  },
  profileName: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 6,
    letterSpacing: -0.3,
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
    flex: 1,
  },
  settingTextContainer: {
    flex: 1,
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
  settingSubtext: {
    fontSize: 12,
    marginTop: 2,
  },
});