import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { Crown, Check, X, Sparkles } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { usePremium } from '../contexts/PremiumContext';
import { useTheme } from '../contexts/ThemeContext';

export default function PaywallScreen() {
  const { purchasePremium, restorePurchases, isLoading } = usePremium();
  const [purchasing, setPurchasing] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const { theme, isDark } = useTheme();

  const premiumFeatures = [
    'Unlimited subscriptions & transactions',
    'AI-powered financial insights',
    'Dark mode & premium themes',
    'Advanced analytics & forecasting',
    'Smart notifications & alerts',
    'Investment tracking',
    'Data export & cloud sync',
    'Priority support'
  ];

  const handleUpgrade = async () => {
    try {
      setPurchasing(true);
      await purchasePremium();
      router.back();
    } catch (error) {
      console.error('Purchase failed:', error);
    } finally {
      setPurchasing(false);
    }
  };

  const handleRestore = async () => {
    try {
      setRestoring(true);
      await restorePurchases();
      router.back();
    } catch (error) {
      console.error('Restore failed:', error);
    } finally {
      setRestoring(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <LinearGradient
        colors={isDark ? ['#0F172A', '#1E293B'] : ['#F8FAFC', '#E2E8F0']}
        style={styles.backgroundGradient}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
            <X size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.crownContainer}>
            <Crown size={48} color="#F59E0B" />
          </View>
          <Text style={[styles.heroTitle, { color: theme.colors.text }]}>Unlock Premium</Text>
          <Text style={[styles.heroSubtitle, { color: theme.colors.textSecondary }]}>
            Get the most out of your financial journey
          </Text>
        </View>

        {/* Features List */}
        <View style={styles.featuresSection}>
          <BlurView intensity={80} tint={isDark ? 'dark' : 'light'} style={styles.featuresCard}>
            <LinearGradient
              colors={isDark 
                ? ['rgba(26, 26, 46, 0.9)', 'rgba(22, 33, 62, 0.7)'] 
                : ['rgba(255, 255, 255, 0.9)', 'rgba(248, 250, 252, 0.7)']}
              style={styles.featuresGradient}
            />
            <View style={styles.featuresContent}>
              {premiumFeatures.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <View style={styles.checkContainer}>
                    <Check size={16} color="#10B981" strokeWidth={3} />
                  </View>
                  <Text style={[styles.featureText, { color: theme.colors.text }]}>{feature}</Text>
                </View>
              ))}
            </View>
          </BlurView>
        </View>

        {/* Pricing */}
        <View style={styles.pricingSection}>
          <View style={styles.priceContainer}>
            <Text style={[styles.price, { color: theme.colors.text }]}>$4.99</Text>
            <Text style={[styles.priceUnit, { color: theme.colors.textSecondary }]}>/month</Text>
          </View>
          <Text style={[styles.pricingDescription, { color: theme.colors.textSecondary }]}>
            Cancel anytime • No commitments
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <BlurView intensity={80} tint={isDark ? 'dark' : 'light'} style={styles.upgradeButton}>
            <TouchableOpacity
              style={[styles.upgradeButtonContent, (purchasing || isLoading) && styles.upgradeButtonDisabled]}
              onPress={handleUpgrade}
              disabled={purchasing || isLoading}
            >
              <LinearGradient
                colors={['#F59E0B', '#D97706']}
                style={styles.upgradeGradient}
              />
              {purchasing ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Crown size={20} color="#FFFFFF" />
                  <Text style={styles.upgradeButtonText}>Start Premium - $4.99/mo</Text>
                </>
              )}
            </TouchableOpacity>
          </BlurView>
          
          <TouchableOpacity
            style={styles.restoreButton}
            onPress={handleRestore}
            disabled={restoring || isLoading}
          >
            {restoring ? (
              <ActivityIndicator size="small" color={theme.colors.primary} />
            ) : (
              <Text style={[styles.restoreButtonText, { color: theme.colors.textSecondary }]}>
                Restore Purchases
              </Text>
            )}
          </TouchableOpacity>
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
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: 'flex-end',
  },
  closeButton: {
    padding: 8,
  },
  heroSection: {
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 48,
  },
  crownContainer: {
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 12,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 26,
  },
  featuresSection: {
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  featuresCard: {
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
  featuresGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  featuresContent: {
    padding: 32,
    gap: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  checkContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#10B98120',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    fontSize: 17,
    fontWeight: '500',
    flex: 1,
    lineHeight: 24,
  },
  pricingSection: {
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 40,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  price: {
    fontSize: 48,
    fontWeight: '800',
    letterSpacing: -1,
  },
  priceUnit: {
    fontSize: 18,
    marginLeft: 4,
  },
  pricingDescription: {
    fontSize: 16,
    textAlign: 'center',
  },
  actionSection: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  upgradeButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  upgradeButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 12,
  },
  upgradeButtonDisabled: {
    opacity: 0.6,
  },
  upgradeGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  upgradeButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  restoreButton: {
    padding: 16,
    alignItems: 'center',
  },
  restoreButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});