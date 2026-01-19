import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Modal } from 'react-native';
import { useCallback, useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Sparkles, ChartBar as BarChart3, History, Calendar, ChevronDown } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { useAnalytics, useBalance, useTransactions } from '../../hooks/useData';
import { useFocusEffect } from '@react-navigation/native';
import { usePremium } from '../../contexts/PremiumContext';
import PremiumLock from '../../components/PremiumLock';
import { useTheme } from '../../contexts/ThemeContext';
import { formatCurrency } from '../../utils/storage';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

type DateRange = 'thisMonth' | 'lastMonth' | 'last3Months' | 'last6Months' | 'thisYear' | 'allTime';

const DATE_RANGE_OPTIONS: { value: DateRange; label: string }[] = [
  { value: 'thisMonth', label: 'This Month' },
  { value: 'lastMonth', label: 'Last Month' },
  { value: 'last3Months', label: 'Last 3 Months' },
  { value: 'last6Months', label: 'Last 6 Months' },
  { value: 'thisYear', label: 'This Year' },
  { value: 'allTime', label: 'All Time' },
];

const getDateRangeLabel = (range: DateRange): string => {
  const option = DATE_RANGE_OPTIONS.find(opt => opt.value === range);
  return option?.label || 'This Month';
};

const getDateRange = (range: DateRange): { startDate: Date; endDate: Date } => {
  const now = new Date();
  const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
  let startDate: Date;

  switch (range) {
    case 'thisMonth':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
      break;
    case 'lastMonth':
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0);
      endDate.setMonth(now.getMonth(), 0);
      endDate.setHours(23, 59, 59);
      break;
    case 'last3Months':
      startDate = new Date(now.getFullYear(), now.getMonth() - 2, 1, 0, 0, 0);
      break;
    case 'last6Months':
      startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1, 0, 0, 0);
      break;
    case 'thisYear':
      startDate = new Date(now.getFullYear(), 0, 1, 0, 0, 0);
      break;
    case 'allTime':
      startDate = new Date(2000, 0, 1, 0, 0, 0);
      break;
    default:
      startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
  }

  return { startDate, endDate };
};

export default function InsightsScreen() {
  const [selectedRange, setSelectedRange] = useState<DateRange>('thisMonth');
  const [showRangeModal, setShowRangeModal] = useState(false);
  const { theme, isDark } = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const dateRange = useMemo(() => getDateRange(selectedRange), [selectedRange]);
  const { monthlySpending, todaySpending, categorySpending, refreshAnalytics } = useAnalytics(
    dateRange.startDate,
    dateRange.endDate
  );
  const { balance, refreshBalance } = useBalance();
  const { transactions, refreshTransactions } = useTransactions();

  const monthlyIncome = transactions
    .filter(t => {
      const transactionDate = new Date(t.date);
      return t.type === 'income' &&
             transactionDate >= dateRange.startDate &&
             transactionDate <= dateRange.endDate;
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const savings = monthlyIncome - monthlySpending;
  const savingsRate = monthlyIncome > 0 ? ((savings / monthlyIncome) * 100) : 0;

  const topCategories = Object.entries(categorySpending)
    .map(([name, amount]) => ({
      name,
      amount,
      percentage: monthlySpending > 0 ? Math.round((amount / monthlySpending) * 100) : 0
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 4);

  const getWeeklySpending = (weeksAgo: number) => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() - (weeksAgo * 7));
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    return transactions
      .filter(t => {
        const transactionDate = new Date(t.date);
        return t.type === 'expense' && 
               transactionDate >= startOfWeek && 
               transactionDate <= endOfWeek;
      })
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const thisWeekSpending = getWeeklySpending(0);
  const lastWeekSpending = getWeeklySpending(1);
  const weeklyChange = thisWeekSpending - lastWeekSpending;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      refreshAnalytics(),
      refreshBalance(),
      refreshTransactions()
    ]);
    setRefreshing(false);
  }, [refreshAnalytics, refreshBalance, refreshTransactions]);

  useFocusEffect(
    useCallback(() => {
      refreshAnalytics();
      refreshBalance();
      refreshTransactions();
    }, [refreshAnalytics, refreshBalance, refreshTransactions])
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
        {/* Overview Cards */}
        <View style={styles.overviewSection}>
          <View style={styles.headerContent}>
            <View>
              <Text style={[styles.title, { color: theme.colors.text }]}>Insights</Text>
              <TouchableOpacity onPress={() => setShowRangeModal(true)}>
                <View style={[styles.subtitleContainer, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)' }]}>
                  <Calendar size={16} color={theme.colors.primary} />
                  <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                    {getDateRangeLabel(selectedRange)}
                  </Text>
                  <ChevronDown size={16} color={theme.colors.textSecondary} />
                </View>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => router.push('/transaction-history')}>
              <BlurView intensity={60} tint={isDark ? 'dark' : 'light'} style={styles.historyButton}>
                <History size={20} color={theme.colors.primary} />
              </BlurView>
            </TouchableOpacity>
          </View>

          <View style={styles.overviewCards}>
            <BlurView intensity={80} tint={isDark ? 'dark' : 'light'} style={styles.overviewCard}>
            <LinearGradient
              colors={isDark
                ? ['rgba(22, 24, 33, 0.95)', 'rgba(248, 113, 113, 0.1)']
                : ['rgba(239, 68, 68, 0.08)', 'rgba(239, 68, 68, 0.04)']}
              style={styles.overviewGradient}
            />
            <View style={styles.overviewCardContent}>
              <View style={styles.overviewHeader}>
                <View style={[styles.overviewIconContainer, { backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.1)' }]}>
                  <TrendingDown size={18} color="#EF4444" />
                </View>
                <Text style={[styles.overviewLabel, { color: theme.colors.textSecondary }]}>Total Spent</Text>
              </View>
              <Text style={[styles.overviewAmount, { color: theme.colors.text }]}>${monthlySpending.toFixed(2)}</Text>
              <View style={[styles.overviewSubtextContainer, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)' }]}>
                <Text style={[styles.overviewSubtext, { color: theme.colors.textSecondary }]}>This month</Text>
              </View>
            </View>
            </BlurView>

            <BlurView intensity={80} tint={isDark ? 'dark' : 'light'} style={styles.overviewCard}>
            <LinearGradient
              colors={isDark
                ? ['rgba(22, 24, 33, 0.95)', 'rgba(52, 211, 153, 0.1)']
                : ['rgba(16, 185, 129, 0.08)', 'rgba(16, 185, 129, 0.04)']}
              style={styles.overviewGradient}
            />
            <View style={styles.overviewCardContent}>
              <View style={styles.overviewHeader}>
                <View style={[styles.overviewIconContainer, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.1)' }]}>
                  <TrendingUp size={18} color="#10B981" />
                </View>
                <Text style={[styles.overviewLabel, { color: theme.colors.textSecondary }]}>Savings Rate</Text>
              </View>
              <Text style={[styles.overviewAmount, { color: '#10B981' }]}>{savingsRate.toFixed(0)}%</Text>
              <View style={[styles.overviewSubtextContainer, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)' }]}>
                <Text style={[styles.overviewSubtext, { color: theme.colors.textSecondary }]}>Of income</Text>
              </View>
            </View>
            </BlurView>
          </View>
        </View>

        {/* Weekly Comparison */}
        <BlurView intensity={90} tint={isDark ? 'dark' : 'light'} style={styles.comparisonCard}>
            <LinearGradient
              colors={isDark
                ? ['rgba(22, 24, 33, 0.95)', 'rgba(59, 130, 246, 0.12)']
                : ['rgba(59, 130, 246, 0.05)', 'rgba(59, 130, 246, 0.02)']}
              style={styles.comparisonGradient}
            />
            <View style={styles.comparisonCardContent}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Week Comparison</Text>
              <View style={styles.comparisonContent}>
                <View style={styles.comparisonItem}>
                  <View style={[styles.comparisonLabelContainer, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)' }]}>
                    <Text style={[styles.comparisonLabel, { color: theme.colors.textSecondary }]}>This Week</Text>
                  </View>
                  <Text style={[styles.comparisonAmount, { color: theme.colors.text }]}>${thisWeekSpending.toFixed(2)}</Text>
                </View>
                <View style={[styles.comparisonDivider, { backgroundColor: theme.colors.border }]} />
                <View style={styles.comparisonItem}>
                  <View style={[styles.comparisonLabelContainer, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)' }]}>
                    <Text style={[styles.comparisonLabel, { color: theme.colors.textSecondary }]}>Last Week</Text>
                  </View>
                  <Text style={[styles.comparisonAmount, { color: theme.colors.text }]}>${lastWeekSpending.toFixed(2)}</Text>
                </View>
              </View>
              <View style={[styles.changeIndicator, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)' }]}>
                {weeklyChange <= 0 ? (
                  <TrendingUp size={16} color="#10B981" />
                ) : (
                  <TrendingDown size={16} color="#EF4444" />
                )}
                <Text style={[styles.changeText, { color: weeklyChange <= 0 ? '#10B981' : '#EF4444' }]}>
                  {weeklyChange <= 0 
                    ? `You saved $${Math.abs(weeklyChange).toFixed(2)} compared to last week`
                    : `You spent $${weeklyChange.toFixed(2)} more than last week`
                  }
                </Text>
              </BlurView>
            </View>
          </BlurView>

        {/* Spending Chart */}
        <BlurView intensity={80} tint={isDark ? 'dark' : 'light'} style={styles.chartCard}>
          <LinearGradient
            colors={isDark
              ? ['rgba(22, 24, 33, 0.95)', 'rgba(251, 191, 36, 0.1)']
              : ['rgba(245, 158, 11, 0.05)', 'rgba(245, 158, 11, 0.02)']}
            style={styles.chartGradient}
          />
          <View style={styles.chartCardContent}>
            <View style={styles.chartHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Top Categories</Text>
            </View>
            
            <BlurView intensity={60} tint={isDark ? 'dark' : 'light'} style={styles.ringChart}>
                  <LinearGradient
                    colors={isDark
                      ? ['rgba(22, 24, 33, 0.9)', 'rgba(16, 18, 25, 0.8)']
                      : ['rgba(255, 255, 255, 0.8)', 'rgba(248, 250, 252, 0.6)']}
                    style={styles.ringChartGradient}
                  />
                  <View style={styles.ringChartContent}>
                    <View style={[styles.ringChartInner, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)' }]}>
                      <DollarSign size={24} color={theme.colors.primary} />
                      <Text style={[styles.ringChartAmount, { color: theme.colors.text }]}>{formatCurrency(monthlySpending)}</Text>
                      <Text style={[styles.ringChartLabel, { color: theme.colors.textSecondary }]}>Total Spent</Text>
                    </View>
                  </View>
                </BlurView>
                
                <View style={styles.categoriesList}>
                  {topCategories.length > 0 ? topCategories.map((category, index) => (
                    <BlurView key={index} intensity={40} tint={isDark ? 'dark' : 'light'} style={styles.categoryItem}>
                      <LinearGradient
                        colors={isDark
                          ? ['rgba(22, 24, 33, 0.9)', 'rgba(16, 18, 25, 0.8)']
                          : ['rgba(255, 255, 255, 0.8)', 'rgba(248, 250, 252, 0.6)']}
                        style={styles.categoryItemGradient}
                      />
                      <View style={styles.categoryItemContent}>
                        <View style={styles.categoryLeft}>
                          <View style={[styles.categoryDot, { backgroundColor: getCategoryColor(index) }]} />
                          <Text style={[styles.categoryName, { color: theme.colors.text }]}>{category.name}</Text>
                        </View>
                        <View style={styles.categoryRight}>
                          <Text style={[styles.categoryAmount, { color: theme.colors.text }]}>${category.amount.toFixed(2)}</Text>
                          <View style={[styles.categoryPercentageContainer, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)' }]}>
                            <Text style={[styles.categoryPercentage, { color: theme.colors.textSecondary }]}>{category.percentage}%</Text>
                          </View>
                        </View>
                      </View>
                    </BlurView>
                  )) : (
                    <BlurView intensity={40} tint={isDark ? 'dark' : 'light'} style={styles.noData}>
                      <LinearGradient
                        colors={isDark
                          ? ['rgba(22, 24, 33, 0.9)', 'rgba(16, 18, 25, 0.8)']
                          : ['rgba(255, 255, 255, 0.8)', 'rgba(248, 250, 252, 0.6)']}
                        style={styles.noDataGradient}
                      />
                      <View style={styles.noDataContent}>
                        <Text style={[styles.noDataText, { color: theme.colors.textSecondary }]}>No spending data yet</Text>
                        <Text style={[styles.noDataSubtext, { color: theme.colors.textSecondary }]}>Add some transactions to see insights</Text>
                      </View>
                    </BlurView>
                  )}
                </View>
          </View>
        </BlurView>

        {/* Friendly Insights */}
        <View style={styles.friendlyInsights}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Money Insights</Text>
          
          {monthlyIncome > 0 && (
                <BlurView intensity={50} tint={isDark ? 'dark' : 'light'} style={styles.insightCard}>
                  <LinearGradient
                    colors={isDark
                      ? ['rgba(22, 24, 33, 0.9)', 'rgba(16, 18, 25, 0.8)']
                      : ['rgba(255, 255, 255, 0.8)', 'rgba(248, 250, 252, 0.6)']}
                    style={styles.insightCardGradient}
                  />
                  <View style={styles.insightCardContent}>
                    <Text style={[styles.insightText, { color: theme.colors.text }]}>
                      You're doing great! You've saved <Text style={styles.insightHighlight}>{savingsRate.toFixed(0)}%</Text> of your income this month.
                    </Text>
                  </View>
                </BlurView>
              )}
              
              {topCategories.length > 0 && (
                <BlurView intensity={50} tint={isDark ? 'dark' : 'light'} style={styles.insightCard}>
                  <LinearGradient
                    colors={isDark
                      ? ['rgba(22, 24, 33, 0.9)', 'rgba(16, 18, 25, 0.8)']
                      : ['rgba(255, 255, 255, 0.8)', 'rgba(248, 250, 252, 0.6)']}
                    style={styles.insightCardGradient}
                  />
                  <View style={styles.insightCardContent}>
                    <Text style={[styles.insightText, { color: theme.colors.text }]}>
                      Your biggest spending category is <Text style={styles.insightHighlight}>{topCategories[0].name}</Text>. 
                      Consider ways to optimize this expense.
                    </Text>
                  </View>
                </BlurView>
              )}
              
              {weeklyChange !== 0 && (
                <BlurView intensity={50} tint={isDark ? 'dark' : 'light'} style={styles.insightCard}>
                  <LinearGradient
                    colors={isDark
                      ? ['rgba(22, 24, 33, 0.9)', 'rgba(16, 18, 25, 0.8)']
                      : ['rgba(255, 255, 255, 0.8)', 'rgba(248, 250, 252, 0.6)']}
                    style={styles.insightCardGradient}
                  />
                  <View style={styles.insightCardContent}>
                    <Text style={[styles.insightText, { color: theme.colors.text }]}>
                      You spent <Text style={styles.insightHighlight}>${Math.abs(weeklyChange).toFixed(2)} {weeklyChange <= 0 ? 'less' : 'more'}</Text> this week. 
                      {weeklyChange <= 0 ? 'Keep up the good work!' : 'Try to be more mindful of your spending.'}
                    </Text>
                  </View>
                </BlurView>
              )}
              
              {monthlySpending === 0 && monthlyIncome === 0 && (
                <BlurView intensity={50} tint={isDark ? 'dark' : 'light'} style={styles.insightCard}>
                  <LinearGradient
                    colors={isDark
                      ? ['rgba(22, 24, 33, 0.9)', 'rgba(16, 18, 25, 0.8)']
                      : ['rgba(255, 255, 255, 0.8)', 'rgba(248, 250, 252, 0.6)']}
                    style={styles.insightCardGradient}
                  />
                  <View style={styles.insightCardContent}>
                    <Text style={[styles.insightText, { color: theme.colors.text }]}>
                      Start tracking your income and expenses to get personalized insights about your spending habits.
                    </Text>
                  </View>
                </BlurView>
              )}
        </View>
      </ScrollView>

      <Modal visible={showRangeModal} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowRangeModal(false)}
        >
          <BlurView intensity={90} tint={isDark ? 'dark' : 'light'} style={styles.rangeModal}>
            <View style={styles.rangeModalContent}>
              <Text style={[styles.rangeModalTitle, { color: theme.colors.text }]}>Select Date Range</Text>

              {DATE_RANGE_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => {
                    setSelectedRange(option.value);
                    setShowRangeModal(false);
                  }}
                  style={[
                    styles.rangeOption,
                    selectedRange === option.value && { backgroundColor: isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)' }
                  ]}
                >
                  <Text style={[
                    styles.rangeOptionText,
                    { color: theme.colors.text },
                    selectedRange === option.value && { color: theme.colors.primary, fontWeight: '600' }
                  ]}>
                    {option.label}
                  </Text>
                  {selectedRange === option.value && (
                    <View style={[styles.selectedIndicator, { backgroundColor: theme.colors.primary }]} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </BlurView>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const getCategoryColor = (index: number) => {
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];
  return colors[index % colors.length];
};

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
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  subtitle: {
    fontSize: 14,
  },
  sparkleContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  historyButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  overviewSection: {
    paddingHorizontal: 24,
    paddingTop: 60,
    marginBottom: 32,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  overviewCards: {
    flexDirection: 'row',
    gap: 16,
  },
  overviewCard: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  overviewGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overviewCardContent: {
    padding: 24,
  },
  overviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  overviewIconContainer: {
    borderRadius: 12,
    padding: 8,
  },
  overviewLabel: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.3,
    opacity: 0.8,
    flex: 1,
  },
  overviewAmount: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  overviewSubtextContainer: {
    alignSelf: 'flex-start',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  overviewSubtext: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.2,
    opacity: 0.9,
  },
  comparisonCard: {
    marginHorizontal: 24,
    marginBottom: 32,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },
  comparisonGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  comparisonCardContent: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
  },
  comparisonContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  comparisonItem: {
    alignItems: 'center',
  },
  comparisonLabelContainer: {
    borderRadius: 8,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  comparisonLabel: {
    fontSize: 14,
  },
  comparisonAmount: {
    fontSize: 20,
    fontWeight: '700',
  },
  comparisonDivider: {
    width: 1,
    height: 40,
  },
  changeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 12,
  },
  changeText: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  chartCard: {
    marginHorizontal: 24,
    marginBottom: 32,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },
  chartGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  chartCardContent: {
    padding: 24,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  premiumOverlay: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  ringChart: {
    alignItems: 'center',
    marginBottom: 24,
    borderRadius: 80,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  ringChartGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  ringChartContent: {
    padding: 20,
  },
  ringChartInner: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  ringChartAmount: {
    fontSize: 20,
    fontWeight: '700',
  },
  ringChartLabel: {
    fontSize: 12,
  },
  categoriesList: {
    gap: 12,
  },
  categoryItem: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  categoryItemGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  categoryItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '500',
  },
  categoryRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  categoryPercentageContainer: {
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  categoryPercentage: {
    fontSize: 12,
  },
  noData: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  noDataGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  noDataContent: {
    alignItems: 'center',
    padding: 20,
  },
  noDataText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  noDataSubtext: {
    fontSize: 14,
  },
  friendlyInsights: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  premiumLockContainer: {
    marginBottom: 16,
  },
  insightCard: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  insightCardGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  insightCardContent: {
    padding: 20,
  },
  insightText: {
    fontSize: 16,
    lineHeight: 24,
  },
  insightHighlight: {
    fontWeight: '600',
    color: '#3B82F6',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  rangeModal: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 10,
  },
  rangeModalContent: {
    padding: 24,
  },
  rangeModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
  },
  rangeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  rangeOptionText: {
    fontSize: 16,
  },
  selectedIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});