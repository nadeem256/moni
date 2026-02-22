import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description?: string;
  date: string;
  created_at: string;
}

interface Subscription {
  id: string;
  name: string;
  amount: number;
  category: string;
  color: string;
  renew_date: string;
  created_at: string;
}

function escapeCSVField(field: any): string {
  if (field === null || field === undefined) {
    return '';
  }
  const stringField = String(field);
  if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
    return `"${stringField.replace(/"/g, '""')}"`;
  }
  return stringField;
}

function convertToCSV(data: any[], headers: string[]): string {
  const csvHeaders = headers.join(',');
  const csvRows = data.map(row =>
    headers.map(header => escapeCSVField(row[header])).join(',')
  );
  return [csvHeaders, ...csvRows].join('\n');
}

export async function exportTransactionsToCSV(transactions: Transaction[]): Promise<void> {
  const headers = ['date', 'type', 'category', 'amount', 'description'];
  const csvContent = convertToCSV(transactions, headers);

  const fileName = `moni_transactions_${new Date().toISOString().split('T')[0]}.csv`;

  if (Platform.OS === 'web') {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    const fileUri = FileSystem.documentDirectory + fileName;
    await FileSystem.writeAsStringAsync(fileUri, csvContent, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      await Sharing.shareAsync(fileUri);
    } else {
      throw new Error('Sharing is not available on this device');
    }
  }
}

export async function exportSubscriptionsToCSV(subscriptions: Subscription[]): Promise<void> {
  const headers = ['name', 'category', 'amount', 'renew_date', 'color'];
  const csvContent = convertToCSV(subscriptions, headers);

  const fileName = `moni_subscriptions_${new Date().toISOString().split('T')[0]}.csv`;

  if (Platform.OS === 'web') {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    const fileUri = FileSystem.documentDirectory + fileName;
    await FileSystem.writeAsStringAsync(fileUri, csvContent, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      await Sharing.shareAsync(fileUri);
    } else {
      throw new Error('Sharing is not available on this device');
    }
  }
}

export async function exportAllData(
  transactions: Transaction[],
  subscriptions: Subscription[]
): Promise<void> {
  const transactionsCSV = convertToCSV(transactions, ['date', 'type', 'category', 'amount', 'description']);
  const subscriptionsCSV = convertToCSV(subscriptions, ['name', 'category', 'amount', 'renew_date', 'color']);

  const combinedContent = `TRANSACTIONS\n${transactionsCSV}\n\n\nSUBSCRIPTIONS\n${subscriptionsCSV}`;
  const fileName = `moni_data_export_${new Date().toISOString().split('T')[0]}.csv`;

  if (Platform.OS === 'web') {
    const blob = new Blob([combinedContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    const fileUri = FileSystem.documentDirectory + fileName;
    await FileSystem.writeAsStringAsync(fileUri, combinedContent, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      await Sharing.shareAsync(fileUri);
    } else {
      throw new Error('Sharing is not available on this device');
    }
  }
}
