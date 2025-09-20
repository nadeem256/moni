import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { Crown, Check, X, Sparkles, Zap, Shield, TrendingUp, Download, Bell, ChartBar as BarChart3 } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { usePremium } from '../contexts/PremiumContext';
import { useTheme } from '../contexts/ThemeContext';

const { width } = Dimensions.get('window');

export default function PaywallScreen() {
  const { purchasePremium, restorePurchases, isLoading } = usePremium();
  const [purchasing, setPurchasing] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const { theme } = useTheme();

  const premiumFeatures = [
    {
      icon: Crown,
      title: 'Unlimited Everything',
      description: 'Track unlimited subscriptions, transactions & budgets',
      color: '#F59E0B',
    },
    {
      icon: Zap,
      title: 'AI Financial Assistant',
      description: 'Smart insights, predictions & personalized advice',
      color: '#3B82F6',
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics & Forecasting',
      description: 'Predict future spending, cash flow & savings goals',
      color: '#10B981',
    },
    {
      icon: Bell,
      title: 'Smart Notifications & Alerts',
      description: 'Price change alerts, bill reminders & spending warnings',
      color: '#EF4444',
    },
    {
      icon: TrendingUp,
      title: 'Investment Tracking',
      description: 'Track stocks, crypto & portfolio performance',
      color: '#8B5CF6',
    },
    {
      icon: Download,
      title: 'Advanced Export & Sync',
      description: 'Export to Excel, sync across devices & backup',
      color: '#06B6D4',
    },
    {
      icon: Shield,
      title: 'Bank-Level Security',
      description: '256-bit encryption, biometric lock & secure cloud sync',
      color: '#F59E0B',
    },
    {
      icon: Crown,
      title: 'Premium Support & Features',
      description: 'Priority support, early access & exclusive features',
      color: '#10B981',
    },
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
        colors={['#F8FAFC', '#E2E8F0', '#CBD5E1']}
        style={styles.backgroundGradient}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <BlurView intensity={60} tint="light" style={styles.closeButton}>
            <TouchableOpacity style={styles.closeButtonInner} onPress={() => router.back()}>
              <X size={24} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </BlurView>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <BlurView intensity={100} tint="light" style={styles.heroCard}>
            <LinearGradient
              colors={['rgba(245, 158, 11, 0.2)', 'rgba(245, 158, 11, 0.1)']}
              style={styles.heroGradient}
            />
            <View style={styles.heroContent}>
              <View style={styles.crownContainer}>
                <Crown size={48} color="#F59E0B" />
                <Sparkles size={20} color="#F59E0B" style={styles.sparkle1} />
                <Sparkles size={16} color="#F59E0B" style={styles.sparkle2} />
                <Sparkles size={12} color="#F59E0B" style={styles.sparkle3} />
              </View>
              <Text style={[styles.heroTitle, { color: theme.colors.text }]}>Unlock Premium</Text>
              <Text style={styles.heroSubtitle}>Your AI-Powered Financial Command Center</Text>
              <BlurView intensity={40} tint={theme.isDark ? 'dark' : 'light'} style={styles.heroBadge}>
                <Text style={[styles.heroBadgeText, { color: theme.colors.textSecondary }]}>
                  Join 50,000+ users who've improved their financial health by 40%
                </Text>
              </BlurView>
            </View>
          </BlurView>
        </View>

        {/* Features Grid */}
        <View style={styles.featuresSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Everything You Get</Text>
          
          <View style={styles.featuresGrid}>
            {premiumFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <BlurView key={index} intensity={70} tint="light" style={styles.featureCard}>
                  <LinearGradient
                    colors={[`${feature.color}08`, `${feature.color}04`]}
                    style={styles.featureGradient}
                  />
                  <View style={styles.featureContent}>
                    <BlurView intensity={50} tint="light" style={styles.featureIconContainer}>
                      <View style={[styles.featureIcon, { backgroundColor: `${feature.color}20` }]}>
                        <IconComponent size={24} color={feature.color} />
                      </View>
                    </BlurView>
                    <Text style={[styles.featureTitle, { color: theme.colors.text }]}>{feature.title}</Text>
                    <Text style={[styles.featureDescription, { color: theme.colors.textSecondary }]}>
                      {feature.description}
                    </Text>
                    <BlurView intensity={30} tint={theme.isDark ? 'dark' : 'light'} style={styles.checkContainer}>
                      <Check size={16} color="#10B981" />
                    </BlurView>
                  </View>
                </BlurView>
              );
            })}
          </View>
        </View>

        {/* Pricing Section */}
        <View style={styles.pricingSection}>
          <BlurView intensity={90} tint="light" style={styles.pricingCard}>
            <LinearGradient
              colors={['rgba(245, 158, 11, 0.08)', 'rgba(245, 158, 11, 0.04)']}
              style={styles.pricingGradient}
            />
            <View style={styles.pricingContent}>
              <View style={styles.pricingHeader}>
                <BlurView intensity={40} tint="light" style={styles.popularBadge}>
                  <Zap size={16} color="#F59E0B" />
                  <Text style={styles.popularText}>Most Popular</Text>
                </BlurView>
              </View>
              
              <View style={styles.priceContainer}>
                <Text style={[styles.price, { color: theme.colors.text }]}>$4.99</Text>
                <Text style={[styles.priceUnit, { color: theme.colors.textSecondary }]}>/month</Text>
              </View>
              
              <Text style={[styles.pricingDescription, { color: theme.colors.textSecondary }]}>
                Complete financial control with AI-powered insights
              </Text>
              
              <View style={styles.pricingFeatures}>
                <View style={styles.pricingFeature}>
                  <Check size={16} color="#10B981" />
                  <Text style={[styles.pricingFeatureText, { color: theme.colors.text }]}>
                    Everything in Free Plan
                  </Text>
                </View>
                <View style={styles.pricingFeature}>
                  <Check size={16} color="#10B981" />
                  <Text style={[styles.pricingFeatureText, { color: theme.colors.text }]}>
                    AI Financial Assistant & Predictions
                  </Text>
                </View>
                <View style={styles.pricingFeature}>
                  <Check size={16} color="#10B981" />
                  <Text style={[styles.pricingFeatureText, { color: theme.colors.text }]}>
                    Investment & Portfolio Tracking
                  </Text>
                </View>
                <View style={styles.pricingFeature}>
                  <Check size={16} color="#10B981" />
                  <Text style={[styles.pricingFeatureText, { color: theme.colors.text }]}>
                    Advanced Security & Cloud Sync
                  </Text>
                </View>
                <View style={styles.pricingFeature}>
                  <Check size={16} color="#10B981" />
                  <Text style={[styles.pricingFeatureText, { color: theme.colors.text }]}>
                    Smart Alerts & Notifications
                  </Text>
                </View>
                <View style={styles.pricingFeature}>
                  <Check size={16} color="#10B981" />
                  <Text style={[styles.pricingFeatureText, { color: theme.colors.text }]}>
                    Premium Support & Early Access
                  </Text>
                </View>
              </View>
            </View>
          </BlurView>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <BlurView intensity={80} tint="light" style={styles.upgradeButton}>
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
                  <Text style={styles.upgradeButtonText}>Start Premium</Text>
                  <BlurView intensity={30} tint="light" style={styles.priceTag}>
                    <Text style={styles.priceTagText}>$4.99</Text>
                  </BlurView>
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
              <Text style={[styles.restoreButtonText, { color: theme.colors.primary }]}>
                Restore Purchases
              </Text>
            )}
          </TouchableOpacity>
          
          <Text style={[styles.terms, { color: theme.colors.textSecondary }]}>
            Cancel anytime • No commitments • Secure payments
          </Text>
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
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  closeButtonInner: {
    padding: 8,
  },
  heroSection: {
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  heroCard: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
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
  crownContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  sparkle1: {
    position: 'absolute',
    top: -8,
    right: -12,
  },
  sparkle2: {
    position: 'absolute',
    bottom: -4,
    left: -16,
  },
  sparkle3: {
    position: 'absolute',
    top: 8,
    left: -8,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#F59E0B',
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  heroBadge: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  heroBadgeText: {
    fontSize: 14,
    paddingHorizontal: 16,
    paddingVertical: 8,
    textAlign: 'center',
  },
  featuresSection: {
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  featureCard: {
    width: (width - 64) / 2,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  featureGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  featureContent: {
    padding: 20,
    alignItems: 'center',
    minHeight: 160,
  },
  featureIconContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    flex: 1,
  },
  checkContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
    borderWidth: 0.5,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  pricingSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  pricingCard: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 8,
  },
  pricingGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  pricingContent: {
    padding: 24,
  },
  pricingHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  popularBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
    borderWidth: 0.5,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  popularText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F59E0B',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: 12,
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
    marginBottom: 24,
  },
  pricingFeatures: {
    gap: 12,
  },
  pricingFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pricingFeatureText: {
    fontSize: 16,
    fontWeight: '500',
  },
  actionSection: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  upgradeButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 0.5,
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
    flex: 1,
    textAlign: 'center',
  },
  priceTag: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  priceTagText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F59E0B',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  restoreButton: {
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  restoreButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  terms: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});