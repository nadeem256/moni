import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { ArrowLeft, TrendingUp, TrendingDown, Trash2, Calendar } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  user_id: string;
}

export default function TransactionHistoryScreen() {
  const { theme, isDark } = useTheme();
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    if (!user?.id) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error loading transactions:', error);
    } else {
      setTransactions(data || []);
    }

    setLoading(false);
  };

  const handleDelete = async (transactionId: string) => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setDeleting(transactionId);

            try {
              const { error, data, count } = await supabase
                .from('transactions')
                .delete()
                .eq('id', transactionId)
                .select();

              console.log('Delete result:', { error, data, count });

              if (error) {
                console.error('Error deleting transaction:', error);
                Alert.alert('Error', `Failed to delete: ${error.message}`);
              } else {
                console.log('Transaction deleted successfully');
                setTransactions(prev => prev.filter(t => t.id !== transactionId));
              }
            } catch (err) {
              console.error('Exception during delete:', err);
              Alert.alert('Error', 'An unexpected error occurred');
            }

            setDeleting(null);
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  const groupTransactionsByDate = () => {
    const groups: { [key: string]: Transaction[] } = {};

    transactions.forEach(transaction => {
      const dateKey = new Date(transaction.date).toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(transaction);
    });

    return Object.entries(groups).map(([date, items]) => ({
      date,
      transactions: items,
    }));
  };

  const groupedTransactions = groupTransactionsByDate();

  const incomeTotal = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenseTotal = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <LinearGradient
        colors={isDark ? ['#0F0F23', '#1A1A2E', '#16213E'] : ['#F8FAFC', '#E2E8F0', '#CBD5E1']}
        style={styles.backgroundGradient}
      />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>Transaction History</Text>
        <View style={styles.placeholder} />
      </View>

      {transactions.length > 0 && (
        <View style={styles.summarySection}>
          <BlurView intensity={80} tint={isDark ? 'dark' : 'light'} style={styles.summaryCard}>
            <LinearGradient
              colors={isDark
                ? ['rgba(26, 26, 46, 0.9)', 'rgba(22, 33, 62, 0.7)']
                : ['rgba(255, 255, 255, 0.9)', 'rgba(248, 250, 252, 0.7)']}
              style={styles.summaryGradient}
            />
            <View style={styles.summaryContent}>
              <View style={styles.summaryItem}>
                <View style={[styles.summaryIcon, { backgroundColor: `${theme.colors.success}20` }]}>
                  <TrendingUp size={20} color={theme.colors.success} />
                </View>
                <View>
                  <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>Total Income</Text>
                  <Text style={[styles.summaryAmount, { color: theme.colors.success }]}>${incomeTotal.toFixed(2)}</Text>
                </View>
              </View>

              <View style={[styles.summaryDivider, { backgroundColor: theme.colors.border }]} />

              <View style={styles.summaryItem}>
                <View style={[styles.summaryIcon, { backgroundColor: `${theme.colors.error}20` }]}>
                  <TrendingDown size={20} color={theme.colors.error} />
                </View>
                <View>
                  <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>Total Expenses</Text>
                  <Text style={[styles.summaryAmount, { color: theme.colors.error }]}>${expenseTotal.toFixed(2)}</Text>
                </View>
              </View>
            </View>
          </BlurView>
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {groupedTransactions.length > 0 ? (
          groupedTransactions.map((group, groupIndex) => (
            <View key={groupIndex} style={styles.dateGroup}>
              <View style={styles.dateHeader}>
                <Calendar size={16} color={theme.colors.textSecondary} />
                <Text style={[styles.dateText, { color: theme.colors.textSecondary }]}>
                  {formatDate(group.date)}
                </Text>
              </View>

              {group.transactions.map((transaction) => (
                <BlurView key={transaction.id} intensity={60} tint={isDark ? 'dark' : 'light'} style={styles.transactionCard}>
                  <LinearGradient
                    colors={isDark
                      ? ['rgba(26, 26, 46, 0.8)', 'rgba(22, 33, 62, 0.6)']
                      : ['rgba(255, 255, 255, 0.8)', 'rgba(248, 250, 252, 0.6)']}
                    style={styles.transactionGradient}
                  />
                  <View style={styles.transactionContent}>
                    <View style={styles.transactionLeft}>
                      <View style={[
                        styles.transactionIcon,
                        { backgroundColor: transaction.type === 'income' ? `${theme.colors.success}20` : `${theme.colors.error}20` }
                      ]}>
                        {transaction.type === 'income' ? (
                          <TrendingUp size={20} color={theme.colors.success} />
                        ) : (
                          <TrendingDown size={20} color={theme.colors.error} />
                        )}
                      </View>
                      <View style={styles.transactionInfo}>
                        <Text style={[styles.transactionCategory, { color: theme.colors.text }]}>
                          {transaction.category}
                        </Text>
                        {transaction.description ? (
                          <Text style={[styles.transactionDescription, { color: theme.colors.textSecondary }]}>
                            {transaction.description}
                          </Text>
                        ) : null}
                      </View>
                    </View>

                    <View style={styles.transactionRight}>
                      <Text style={[
                        styles.transactionAmount,
                        { color: transaction.type === 'income' ? theme.colors.success : theme.colors.error }
                      ]}>
                        {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                      </Text>

                      <TouchableOpacity
                        style={[styles.deleteButton, { backgroundColor: `${theme.colors.error}20` }]}
                        onPress={() => handleDelete(transaction.id)}
                        disabled={deleting === transaction.id}
                      >
                        {deleting === transaction.id ? (
                          <ActivityIndicator size="small" color={theme.colors.error} />
                        ) : (
                          <Trash2 size={16} color={theme.colors.error} />
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                </BlurView>
              ))}
            </View>
          ))
        ) : (
          <BlurView intensity={60} tint={isDark ? 'dark' : 'light'} style={styles.emptyState}>
            <LinearGradient
              colors={isDark
                ? ['rgba(26, 26, 46, 0.8)', 'rgba(22, 33, 62, 0.6)']
                : ['rgba(255, 255, 255, 0.8)', 'rgba(248, 250, 252, 0.6)']}
              style={styles.emptyGradient}
            />
            <View style={styles.emptyContent}>
              <Calendar size={48} color={theme.colors.textSecondary} />
              <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>No Transactions Yet</Text>
              <Text style={[styles.emptyDescription, { color: theme.colors.textSecondary }]}>
                Start adding transactions to see your history here
              </Text>
            </View>
          </BlurView>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
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
  summarySection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  summaryCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  summaryGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  summaryContent: {
    flexDirection: 'row',
    padding: 20,
    gap: 20,
  },
  summaryItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  summaryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: '700',
  },
  summaryDivider: {
    width: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  dateGroup: {
    marginBottom: 24,
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    paddingLeft: 4,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
  },
  transactionCard: {
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  transactionGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  transactionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionCategory: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  transactionDescription: {
    fontSize: 14,
  },
  transactionRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '700',
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginTop: 40,
  },
  emptyGradient: {
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
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    textAlign: 'center',
  },
});
