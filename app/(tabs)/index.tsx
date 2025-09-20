import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useEffect } from 'react';
import { Bell, TrendingUp, TrendingDown, Plus } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { useBalance, useAnalytics, useSubscriptions } from '../../hooks/useData';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

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
  const { theme } = useTheme();

  const formatRenewalDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays <= 7) return `In ${diffDays} days`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Get upcoming subscriptions (next 7 days)
  const upcomingSubscriptions = subscriptions
    .filter(sub => {
      const renewDate = new Date(sub.renewDate);
      const today = new Date();
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
        colors={['#F8FAFC', '#E2E8F0', '#CBD5E1']}
        style={styles.backgroundGradient}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Balance Card with Enhanced Glass */}
        <View style={styles.heroSection}>
          <View style={styles.headerContent}>
            <View>
              <Text style={[styles.greeting, { color: theme.colors.text }]}>{getGreeting()}</Text>
              <Text style={[styles.subGreeting, { color: theme.colors.textSecondary }]}>{getWelcomeMessage()}</Text>
            </View>
            <BlurView intensity={60} tint="light" style={styles.notificationButton}>
              <TouchableOpacity style={styles.notificationButtonInner}>
                <Bell size={20} color={theme.colors.text} />
                <View style={styles.notificationDot} />
              </TouchableOpacity>
            </BlurView>
          </View>
          
          <BlurView intensity={100} tint="light" style={styles.heroCard}>
            <LinearGradient
              colors={['rgba(59, 130, 246, 0.05)', 'rgba(16, 185, 129, 0.02)']}
              style={styles.heroGradient}
            />
            <View style={styles.heroContent}>
              <Text style={[styles.balanceLabel, { color: theme.colors.textSecondary }]}>Total Balance</Text>
              <Text style={[styles.balanceAmount, { color: theme.colors.text }]}>${balance.toFixed(2)}</Text>
              <View style={styles.balanceInsight}>
                <BlurView intensity={40} tint="light" style={styles.insightPill}>
                  <TrendingUp size={14} color={theme.colors.success} />
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
          <BlurView intensity={60} tint="light" style={styles.statCard}>
            <View style={styles.statContent}>
              <View style={[styles.statIcon, { backgroundColor: `${theme.colors.error}20` }]}>
                <TrendingDown size={18} color={theme.colors.error} />
              </View>
              <Text style={[styles.statAmount, { color: theme.colors.text }]}>${todaySpending.toFixed(0)}</Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Today</Text>
            </View>
          </BlurView>

          <BlurView intensity={60} tint="light" style={styles.statCard}>
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
              <TouchableOpacity style={styles.viewAllContent}>
                <Text style={[styles.viewAllText, { color: theme.colors.primary }]}>View All</Text>
              </TouchableOpacity>
            </BlurView>
          </View>

          {upcomingSubscriptions.length > 0 ? upcomingSubscriptions.map((subscription, index) => (
            <BlurView key={index} intensity={50} tint="light" style={styles.subscriptionCard}>
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
            <BlurView intensity={40} tint="light" style={styles.emptyState}>
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
  headerBlur: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  notificationButton: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  notificationButtonInner: {
    padding: 12,
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
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
  heroCard: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },
  heroGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  heroContent: {
    padding: 32,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    opacity: 0.8,
  },
  balanceAmount: {
    fontSize: 48,
    fontWeight: '800',
    marginBottom: 16,
    letterSpacing: -1,
  },
  balanceInsight: {
    alignItems: 'center',
  },
  insightPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
    borderWidth: 0.5,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  insightText: {
    fontSize: 14,
    fontWeight: '600',
  },
  quickStats: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 16,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
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
  statContent: {
    padding: 20,
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statAmount: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  subscriptionsSection: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  viewAllButton: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  viewAllContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  subscriptionCard: {
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
  subscriptionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  subscriptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  subscriptionIconContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  subscriptionIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subscriptionIconText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  subscriptionInfo: {
    flex: 1,
  },
  subscriptionName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
  },
  subscriptionDate: {
    fontSize: 14,
    fontWeight: '500',
  },
  amountContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  subscriptionAmount: {
    fontSize: 18,
    fontWeight: '700',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  emptyState: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  emptyContent: {
    padding: 32,
    alignItems: 'center',
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
});