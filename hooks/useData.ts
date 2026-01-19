import { useState, useEffect, useCallback } from 'react';
import { 
  Transaction, 
  Subscription, 
  getTransactions, 
  getSubscriptions, 
  getBalance, 
  saveTransaction, 
  saveSubscription, 
  deleteTransaction, 
  deleteSubscription,
  getMonthlySpending,
  getTodaySpending,
  getCategorySpending
} from '../utils/supabaseStorage';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTransactions = useCallback(async () => {
    try {
      const data = await getTransactions();
      setTransactions(data);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addTransaction = useCallback(async (transaction: Omit<Transaction, 'id'>) => {
    try {
      const newTransaction = await saveTransaction(transaction);
      setTransactions(prev => [...prev, newTransaction]);
      return newTransaction;
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  }, []);

  const removeTransaction = useCallback(async (id: string) => {
    try {
      await deleteTransaction(id);
      setTransactions(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error removing transaction:', error);
      throw error;
    }
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  return {
    transactions,
    loading,
    addTransaction,
    removeTransaction,
    refreshTransactions: loadTransactions,
  };
};

export const useSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSubscriptions = useCallback(async () => {
    try {
      const data = await getSubscriptions();
      setSubscriptions(data);
    } catch (error) {
      console.error('Error loading subscriptions:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addSubscription = useCallback(async (subscription: Omit<Subscription, 'id'>) => {
    try {
      const newSubscription = await saveSubscription(subscription);
      setSubscriptions(prev => [...prev, newSubscription]);
      return newSubscription;
    } catch (error) {
      console.error('Error adding subscription:', error);
      throw error;
    }
  }, []);

  const removeSubscription = useCallback(async (id: string) => {
    try {
      await deleteSubscription(id);
      setSubscriptions(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error removing subscription:', error);
      throw error;
    }
  }, []);

  useEffect(() => {
    loadSubscriptions();
  }, [loadSubscriptions]);

  return {
    subscriptions,
    loading,
    addSubscription,
    removeSubscription,
    refreshSubscriptions: loadSubscriptions,
  };
};

export const useBalance = () => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadBalance = useCallback(async () => {
    try {
      const data = await getBalance();
      setBalance(data);
    } catch (error) {
      console.error('Error loading balance:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBalance();
  }, [loadBalance]);

  return {
    balance,
    loading,
    refreshBalance: loadBalance,
  };
};

export const useAnalytics = (startDate?: Date, endDate?: Date) => {
  const [monthlySpending, setMonthlySpending] = useState(0);
  const [todaySpending, setTodaySpending] = useState(0);
  const [categorySpending, setCategorySpending] = useState<{ [category: string]: number }>({});
  const [loading, setLoading] = useState(true);

  const loadAnalytics = useCallback(async () => {
    try {
      const [monthly, today, categories] = await Promise.all([
        getMonthlySpending(startDate, endDate),
        getTodaySpending(),
        getCategorySpending(startDate, endDate)
      ]);

      setMonthlySpending(monthly);
      setTodaySpending(today);
      setCategorySpending(categories);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  return {
    monthlySpending,
    todaySpending,
    categorySpending,
    loading,
    refreshAnalytics: loadAnalytics,
  };
};