import { supabase } from '../lib/supabase';
import { Database } from '../lib/supabase';

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

type DbTransaction = Database['public']['Tables']['transactions']['Row'];
type DbSubscription = Database['public']['Tables']['subscriptions']['Row'];

// Transaction functions
export const getTransactions = async (): Promise<Transaction[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (error) throw error;

    return data.map((transaction: DbTransaction): Transaction => ({
      id: transaction.id,
      amount: Number(transaction.amount),
      type: transaction.type,
      category: transaction.category,
      date: transaction.date,
      description: transaction.description || undefined,
    }));
  } catch (error) {
    console.error('Error getting transactions:', error);
    return [];
  }
};

export const saveTransaction = async (transaction: Omit<Transaction, 'id'>): Promise<Transaction> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        amount: transaction.amount,
        type: transaction.type,
        category: transaction.category,
        date: transaction.date,
        description: transaction.description || null,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      amount: Number(data.amount),
      type: data.type,
      category: data.category,
      date: data.date,
      description: data.description || undefined,
    };
  } catch (error) {
    console.error('Error saving transaction:', error);
    throw error;
  }
};

export const deleteTransaction = async (id: string): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }
};

// Subscription functions
export const getSubscriptions = async (): Promise<Subscription[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .order('renew_date', { ascending: true });

    if (error) throw error;

    return data.map((subscription: DbSubscription): Subscription => ({
      id: subscription.id,
      name: subscription.name,
      amount: Number(subscription.amount),
      renewDate: subscription.renew_date,
      category: subscription.category,
      color: subscription.color,
    }));
  } catch (error) {
    console.error('Error getting subscriptions:', error);
    return [];
  }
};

export const saveSubscription = async (subscription: Omit<Subscription, 'id'>): Promise<Subscription> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('subscriptions')
      .insert({
        user_id: user.id,
        name: subscription.name,
        amount: subscription.amount,
        category: subscription.category,
        color: subscription.color,
        renew_date: subscription.renewDate,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      amount: Number(data.amount),
      renewDate: data.renew_date,
      category: data.category,
      color: data.color,
    };
  } catch (error) {
    console.error('Error saving subscription:', error);
    throw error;
  }
};

export const deleteSubscription = async (id: string): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('subscriptions')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting subscription:', error);
    throw error;
  }
};

// Balance calculation (derived from transactions)
export const getBalance = async (): Promise<number> => {
  try {
    const transactions = await getTransactions();
    
    const balance = transactions.reduce((sum, transaction) => {
      return transaction.type === 'income' 
        ? sum + transaction.amount 
        : sum - transaction.amount;
    }, 0);
    
    return balance;
  } catch (error) {
    console.error('Error calculating balance:', error);
    return 0;
  }
};

// Analytics functions
export const getMonthlySpending = async (startDate?: Date, endDate?: Date): Promise<number> => {
  try {
    const transactions = await getTransactions();

    if (startDate && endDate) {
      return transactions
        .filter(t => {
          const transactionDate = new Date(t.date);
          return t.type === 'expense' &&
                 transactionDate >= startDate &&
                 transactionDate <= endDate;
        })
        .reduce((sum, t) => sum + t.amount, 0);
    }

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

export const getCategorySpending = async (startDate?: Date, endDate?: Date): Promise<{ [category: string]: number }> => {
  try {
    const transactions = await getTransactions();

    const categorySpending: { [category: string]: number } = {};

    if (startDate && endDate) {
      transactions
        .filter(t => {
          const transactionDate = new Date(t.date);
          return t.type === 'expense' &&
                 transactionDate >= startDate &&
                 transactionDate <= endDate;
        })
        .forEach(t => {
          categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount;
        });

      return categorySpending;
    }

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

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

// Format currency helper
export const formatCurrency = (amount: number): string => {
  if (amount >= 1000000000) {
    return `$${(amount / 1000000000).toFixed(1)}B`;
  }
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(1)}K`;
  }
  return `$${amount.toFixed(2)}`;
};

// User settings functions
export const getUserSettings = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      // If no settings exist, create default ones
      if (error.code === 'PGRST116') {
        const { data: newSettings, error: insertError } = await supabase
          .from('user_settings')
          .insert({
            user_id: user.id,
            dark_mode: false,
            notifications: true,
            biometrics: false,
          })
          .select()
          .single();

        if (insertError) throw insertError;
        return newSettings;
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error getting user settings:', error);
    return {
      dark_mode: false,
      notifications: true,
      biometrics: false,
    };
  }
};

export const updateUserSettings = async (settings: {
  dark_mode?: boolean;
  notifications?: boolean;
  biometrics?: boolean;
}) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('user_settings')
      .update(settings)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating user settings:', error);
    throw error;
  }
};