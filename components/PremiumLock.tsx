import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Lock } from 'lucide-react-native';
import { router } from 'expo-router';

interface PremiumLockProps {
  message?: string;
  compact?: boolean;
}

export default function PremiumLock({ message = "Unlock with Premium - AI-powered insights await", compact = false }: PremiumLockProps) {
  const handleUpgrade = () => {
    router.push('/paywall');
  };

  if (compact) {
    return (
      <TouchableOpacity style={styles.compactContainer} onPress={handleUpgrade}>
        <Lock size={16} color="#F59E0B" />
        <Text style={styles.compactText}>Premium</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.lockIcon}>
        <Lock size={24} color="#F59E0B" />
      </View>
      <Text style={styles.message}>{message}</Text>
      <TouchableOpacity style={styles.upgradeButton} onPress={handleUpgrade}>
        <Text style={styles.upgradeText}>Upgrade Now</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FEF3C7',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  lockIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: '#92400E',
    textAlign: 'center',
    marginBottom: 12,
  },
  upgradeButton: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  upgradeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  compactText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F59E0B',
  },
});