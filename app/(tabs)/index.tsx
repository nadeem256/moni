import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Plus } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { useBalance, useAnalytics, useSubscriptions } from '../../hooks/useData';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { formatCurrency } from '../../utils/storage';
import { useTheme } from '../../contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

const getWelcomeMessage = () => {
  const messages = [
    'Ready to take control?',
    'Let\'s check your finances',
    'Your money, simplified',
    'Welcome back',
    'Time to build wealth',
    'Your financial journey continues'
  ];
  const today = new Date().getDate();
  return messages[today % messages.length];
};

export default function HomeScreen() {
  const { balance, refreshBalance } = useBalance();
  const { todaySpending, monthlySpending, refreshAnalytics } = useAnalytics();
  const { subscriptions, refreshSubscriptions } = useSubscriptions();
  const { theme, isDark } = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const formatRenewalDate = (dateString: string) => {
    const date = new Date(dateString);
    date.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays <= 7) return `In ${diffDays} days`;

    const showYear = date.getFullYear() !== today.getFullYear();
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: showYear ? 'numeric' : undefined
    });
  };

  // Get upcoming subscriptions (next 30 days)
  const upcomingSubscriptions = subscriptions
    .filter(sub => {
      const renewDate = new Date(sub.renewDate);
      renewDate.setHours(0, 0, 0, 0);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const diffTime = renewDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 30; // Show subscriptions renewing in next 30 days
    })
    .sort((a, b) => new Date(a.renewDate).getTime() - new Date(b.renewDate).getTime()) // Sort by renewal date
    .slice(0, 3)
    .map(sub => ({
      name: sub.name,
      amount: sub.amount,
      renewDate: formatRenewalDate(sub.renewDate),
      color: sub.color
    }));

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      refreshBalance(),
      refreshAnalytics(),
      refreshSubscriptions()
    ]);
    setRefreshing(false);
  }, [refreshBalance, refreshAnalytics, refreshSubscriptions]);

  useFocusEffect(
    useCallback(() => {
      refreshBalance();
      refreshAnalytics();
      refreshSubscriptions();
    }, [refreshBalance, refreshAnalytics, refreshSubscriptions])
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <LinearGradient
        colors={isDark ? ['#0F0F23', '#1A1A2E', '#16213E'] : ['#F8FAFC', '#E2E8F0', '#CBD5E1']}
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
        {/* Hero Balance Card with Enhanced Glass */}
        <View style={styles.heroSection}>
          <View style={styles.headerContent}>
            <View>
              <Text style={[styles.greeting, { color: theme.colors.text }]}>{getGreeting()}</Text>
              <Text style={[styles.subGreeting, { color: theme.colors.textSecondary }]}>{getWelcomeMessage()}</Text>
            </View>
          </View>
          
          <BlurView intensity={100} tint={isDark ? 'dark' : 'light'} style={styles.heroCard}>
            <LinearGradient
              colors={isDark 
                ? ['rgba(26, 26, 46, 0.9)', 'rgba(52, 211, 153, 0.08)'] 
                : ['rgba(59, 130, 246, 0.05)', 'rgba(16, 185, 129, 0.02)']}
              style={styles.heroGradient}
            />
            <View style={styles.heroContent}>
              <Text style={[styles.balanceLabel, { color: theme.colors.textSecondary }]}>Total Balance</Text>
              <Text style={[styles.balanceAmount, { color: theme.colors.text }]}>{formatCurrency(balance)}</Text>
              <View style={styles.balanceInsight}>
                <BlurView intensity={40} tint="light" style={styles.insightPill}>
                  <TrendingUp size={14} color="#34D399" />
                  <Text style={[styles.insightText, { color: theme.colors.success }]}>
                    +2.4% this month
                  </Text>
                </BlurView>
              </View>
            </View>
          </BlurView>
        </View>

        {/* Quick Stats with Glass Cards */}
        <View style={styles.quickStats}>
          <BlurView intensity={60} tint={isDark ? 'dark' : 'light'} style={styles.statCard}>
            <LinearGradient
              colors={isDark 
                ? ['rgba(26, 26, 46, 0.8)', 'rgba(22, 33, 62, 0.6)'] 
                : ['rgba(255, 255, 255, 0.8)', 'rgba(248, 250, 252, 0.6)']}
              style={styles.statCardGradient}
            />
            <View style={styles.statContent}>
              <View style={[styles.statIcon, { backgroundColor: `${theme.colors.error}20` }]}>
                <TrendingDown size={18} color={theme.colors.error} />
              </View>
              <Text style={[styles.statAmount, { color: theme.colors.text }]}>${todaySpending.toFixed(0)}</Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Today</Text>
            </View>
          </BlurView>

          <BlurView intensity={60} tint={isDark ? 'dark' : 'light'} style={styles.statCard}>
            <LinearGradient
              colors={isDark 
                ? ['rgba(26, 26, 46, 0.8)', 'rgba(22, 33, 62, 0.6)'] 
                : ['rgba(255, 255, 255, 0.8)', 'rgba(248, 250, 252, 0.6)']}
              style={styles.statCardGradient}
            />
            <View style={styles.statContent}>
              <View style={[styles.statIcon, { backgroundColor: `${theme.colors.warning}20` }]}>
                <TrendingDown size={18} color={theme.colors.warning} />
              </View>
              <Text style={[styles.statAmount, { color: theme.colors.text }]}>${monthlySpending.toFixed(0)}</Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>This Month</Text>
            </View>
          </BlurView>
        </View>

        {/* Upcoming Subscriptions with Enhanced Glass */}
        <View style={styles.subscriptionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Upcoming</Text>
            <BlurView intensity={40} tint="light" style={styles.viewAllButton}>
              <TouchableOpacity style={styles.viewAllContent} onPress={() => router.push('/(tabs)/subscriptions')}>
                <Text style={[styles.viewAllText, { color: theme.colors.primary }]}>View All</Text>
              </TouchableOpacity>
            </BlurView>
          </View>

          {upcomingSubscriptions.length > 0 ? upcomingSubscriptions.map((subscription, index) => (
            <BlurView key={index} intensity={50} tint={isDark ? 'dark' : 'light'} style={styles.subscriptionCard}>
              <LinearGradient
                colors={isDark 
                  ? ['rgba(26, 26, 46, 0.8)', 'rgba(22, 33, 62, 0.6)'] 
                  : ['rgba(255, 255, 255, 0.8)', 'rgba(248, 250, 252, 0.6)']}
                style={styles.subscriptionCardGradient}
              />
              <View style={styles.subscriptionContent}>
                <View style={styles.subscriptionLeft}>
                  <BlurView intensity={30} tint="light" style={styles.subscriptionIconContainer}>
                    <View style={[styles.subscriptionIcon, { backgroundColor: subscription.color }]}>
                      <Text style={styles.subscriptionIconText}>
                        {subscription.name.charAt(0)}
                      </Text>
                    </View>
                  </BlurView>
                  <View style={styles.subscriptionInfo}>
                    <Text style={[styles.subscriptionName, { color: theme.colors.text }]}>{subscription.name}</Text>
                    <Text style={[styles.subscriptionDate, { color: theme.colors.textSecondary }]}>{subscription.renewDate}</Text>
                  </View>
                </View>
                <BlurView intensity={30} tint="light" style={styles.amountContainer}>
                  <Text style={[styles.subscriptionAmount, { color: theme.colors.text }]}>${subscription.amount}</Text>
                </BlurView>
              </View>
            </BlurView>
          )) : (
            <BlurView intensity={40} tint={isDark ? 'dark' : 'light'} style={styles.emptyState}>
              <LinearGradient
                colors={isDark 
                  ? ['rgba(26, 26, 46, 0.8)', 'rgba(22, 33, 62, 0.6)'] 
                  : ['rgba(255, 255, 255, 0.8)', 'rgba(248, 250, 252, 0.6)']}
                style={styles.emptyStateGradient}
              />
              <View style={styles.emptyContent}>
                <View style={[styles.emptyIcon, { backgroundColor: `${theme.colors.primary}15` }]}>
                  <Plus size={24} color={theme.colors.primary} />
                </View>
                <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>No upcoming renewals</Text>
                <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>Add subscriptions to track renewals</Text>
              </View>
            </BlurView>
          )}
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
  greeting: {
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 4,
    letterSpacing: -0.8,
  },
  subGreeting: {
    fontSize: 17,
    fontWeight: '600',
    opacity: 0.75,
    letterSpacing: 0.3,
  },
  heroSection: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  heroCard: {
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
  heroGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  heroContent: {
    padding: 40,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 12,
    opacity: 0.7,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  balanceAmount: {
    fontSize: 56,
    fontWeight: '900',
    marginBottom: 20,
    letterSpacing: -1.5,
  },
  balanceInsight: {
    alignItems: 'center',
  },
  insightPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
    borderWidth: 0.5,
    borderColor: 'rgba(52, 211, 153, 0.3)',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  insightText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  quickStats: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 20,
    marginBottom: 40,
  },
  statCard: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  statCardGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  statContent: {
    padding: 24,
    alignItems: 'center',
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  statAmount: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.3,
    opacity: 0.8,
  },
  subscriptionsSection: {
    paddingHorizontal: 24,
    paddingBottom: 120,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  viewAllButton: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.4)',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  viewAllContent: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  subscriptionCard: {
    borderRadius: 24,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  subscriptionCardGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  subscriptionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
  },
  subscriptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    flex: 1,
  },
  subscriptionIconContainer: {
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  subscriptionIcon: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subscriptionIconText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  subscriptionInfo: {
    flex: 1,
    gap: 4,
  },
  subscriptionName: {
    fontSize: 19,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  subscriptionDate: {
    fontSize: 13,
    fontWeight: '600',
    opacity: 0.8,
    letterSpacing: 0.2,
  },
  amountContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  subscriptionAmount: {
    fontSize: 17,
    fontWeight: '800',
    paddingHorizontal: 16,
    paddingVertical: 10,
    letterSpacing: -0.2,
  },
  emptyState: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  emptyStateGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  emptyContent: {
    padding: 40,
    alignItems: 'center',
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 19,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  emptySubtitle: {
    fontSize: 15,
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 22,
  },
});