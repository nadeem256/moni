import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  description?: string;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  renewDate: string;
  category: string;
  color: string;
}

const TRANSACTIONS_KEY = 'transactions';
const SUBSCRIPTIONS_KEY = 'subscriptions';
const BALANCE_KEY = 'balance';

// Transaction functions
export const getTransactions = async (): Promise<Transaction[]> => {
  try {
    const data = await AsyncStorage.getItem(TRANSACTIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting transactions:', error);
    return [];
  }
};

export const saveTransaction = async (transaction: Omit<Transaction, 'id'>): Promise<Transaction> => {
  try {
    const transactions = await getTransactions();
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    
    const updatedTransactions = [...transactions, newTransaction];
    await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(updatedTransactions));
    
    // Update balance
    await updateBalance(transaction.type === 'income' ? transaction.amount : -transaction.amount);
    
    return newTransaction;
  } catch (error) {
    console.error('Error saving transaction:', error);
    throw error;
  }
};

export const deleteTransaction = async (id: string): Promise<void> => {
  try {
    const transactions = await getTransactions();
    const transactionToDelete = transactions.find(t => t.id === id);
    
    if (transactionToDelete) {
      const updatedTransactions = transactions.filter(t => t.id !== id);
      await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(updatedTransactions));
      
      // Reverse the balance change
      const balanceChange = transactionToDelete.type === 'income' ? -transactionToDelete.amount : transactionToDelete.amount;
      await updateBalance(balanceChange);
    }
  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }
};

// Subscription functions
export const getSubscriptions = async (): Promise<Subscription[]> => {
  try {
    const data = await AsyncStorage.getItem(SUBSCRIPTIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting subscriptions:', error);
    return [];
  }
};

export const saveSubscription = async (subscription: Omit<Subscription, 'id'>): Promise<Subscription> => {
  try {
    const subscriptions = await getSubscriptions();
    const newSubscription: Subscription = {
      ...subscription,
      id: Date.now().toString(),
    };
    
    const updatedSubscriptions = [...subscriptions, newSubscription];
    await AsyncStorage.setItem(SUBSCRIPTIONS_KEY, JSON.stringify(updatedSubscriptions));
    
    return newSubscription;
  } catch (error) {
    console.error('Error saving subscription:', error);
    throw error;
  }
};

export const deleteSubscription = async (id: string): Promise<void> => {
  try {
    const subscriptions = await getSubscriptions();
    const updatedSubscriptions = subscriptions.filter(s => s.id !== id);
    await AsyncStorage.setItem(SUBSCRIPTIONS_KEY, JSON.stringify(updatedSubscriptions));
  } catch (error) {
    console.error('Error deleting subscription:', error);
    throw error;
  }
};

// Balance functions
export const getBalance = async (): Promise<number> => {
  try {
    const data = await AsyncStorage.getItem(BALANCE_KEY);
    const balance = data ? parseFloat(data) : 0;
    return isNaN(balance) ? 0 : balance;
  } catch (error) {
    console.error('Error getting balance:', error);
    return 0;
  }
};

export const updateBalance = async (change: number): Promise<number> => {
  try {
    if (isNaN(change)) {
      console.error('Invalid change amount:', change);
      return await getBalance();
    }
    
    const currentBalance = await getBalance();
    const newBalance = (isNaN(currentBalance) ? 0 : currentBalance) + change;
    
    if (isNaN(newBalance)) {
      console.error('Calculated balance is NaN:', { currentBalance, change });
      return currentBalance;
    }
    
    await AsyncStorage.setItem(BALANCE_KEY, newBalance.toString());
    return newBalance;
  } catch (error) {
    console.error('Error updating balance:', error);
    return await getBalance();
  }
};

export const setBalance = async (balance: number): Promise<void> => {
  try {
    await AsyncStorage.setItem(BALANCE_KEY, balance.toString());
  } catch (error) {
    console.error('Error setting balance:', error);
    throw error;
  }
};

// Analytics functions
export const getMonthlySpending = async (): Promise<number> => {
  try {
    const transactions = await getTransactions();
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return transactions
      .filter(t => {
        const transactionDate = new Date(t.date);
        return t.type === 'expense' && 
               transactionDate.getMonth() === currentMonth && 
               transactionDate.getFullYear() === currentYear;
      })
      .reduce((sum, t) => sum + t.amount, 0);
  } catch (error) {
    console.error('Error getting monthly spending:', error);
    return 0;
  }
};

export const getTodaySpending = async (): Promise<number> => {
  try {
    const transactions = await getTransactions();
    const today = new Date().toDateString();
    
    return transactions
      .filter(t => t.type === 'expense' && new Date(t.date).toDateString() === today)
      .reduce((sum, t) => sum + t.amount, 0);
  } catch (error) {
    console.error('Error getting today spending:', error);
    return 0;
  }
};

export const getCategorySpending = async (): Promise<{ [category: string]: number }> => {
  try {
    const transactions = await getTransactions();
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const categorySpending: { [category: string]: number } = {};
    
    transactions
      .filter(t => {
        const transactionDate = new Date(t.date);
        return t.type === 'expense' && 
               transactionDate.getMonth() === currentMonth && 
               transactionDate.getFullYear() === currentYear;
      })
      .forEach(t => {
        categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount;
      });
    
    return categorySpending;
  } catch (error) {
    console.error('Error getting category spending:', error);
    return {};
  }
};