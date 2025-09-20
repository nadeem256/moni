import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { useState, useCallback } from 'react';
import { Plus, Calendar, X, Sparkles, Trash2 } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { useSubscriptions } from '../../hooks/useData';
import { useFocusEffect } from '@react-navigation/native';
import { usePremium } from '../../contexts/PremiumContext';
import PremiumLock from '../../components/PremiumLock';
import { useTheme } from '../../contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

export default function SubscriptionsScreen() {
  const { subscriptions, refreshSubscriptions, removeSubscription } = useSubscriptions();
  const { isPremium } = usePremium();
  const [showAddModal, setShowAddModal] = useState(false);
  const { theme, isDark } = useTheme();

  const totalMonthly = subscriptions.reduce((sum, sub) => sum + sub.amount, 0);
  const canAddMore = isPremium || subscriptions.length < 3;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 0) return 'Past due';
    if (diffDays <= 7) return `In ${diffDays} days`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleDeleteSubscription = (subscriptionId: string, subscriptionName: string) => {
    Alert.alert(
      'Delete Subscription',
      `Are you sure you want to delete "${subscriptionName}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeSubscription(subscriptionId);
              refreshSubscriptions();
            } catch (error) {
              console.error('Error deleting subscription:', error);
              Alert.alert('Error', 'Failed to delete subscription. Please try again.');
            }
          },
        },
      ]
    );
  };

  useFocusEffect(
    useCallback(() => {
      refreshSubscriptions();
    }, [refreshSubscriptions])
  );

  const handleAddSubscription = () => {
    if (!canAddMore) {
      // Show premium upsell
      router.push('/paywall');
    } else {
      setShowAddModal(true);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <LinearGradient
        colors={isDark ? ['#0F172A', '#1E293B', '#334155'] : ['#F8FAFC', '#E2E8F0', '#CBD5E1']}
        style={styles.backgroundGradient}
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Monthly Total Card */}
        <View style={styles.heroSection}>
          <View style={styles.headerContent}>
            <View>
              <Text style={[styles.title, { color: theme.colors.text }]}>Subscriptions</Text>
              <BlurView intensity={40} tint={theme.isDark ? 'dark' : 'light'} style={styles.subtitleContainer}>
                <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>{subscriptions.length} active</Text>
              </BlurView>
            </View>
            <BlurView intensity={80} tint={theme.isDark ? 'dark' : 'light'} style={styles.addButton}>
              <TouchableOpacity 
                style={styles.addButtonContent}
                onPress={handleAddSubscription}
              >
                <LinearGradient
                  colors={['#3B82F6', '#1D4ED8']}
                  style={styles.addButtonGradient}
                />
                <View style={styles.addButtonIconContainer}>
                  <Plus size={24} color="#FFFFFF" strokeWidth={3} />
                </View>
              </TouchableOpacity>
            </BlurView>
          </View>
          
          <BlurView intensity={100} tint={isDark ? 'dark' : 'light'} style={styles.totalCard}>
            <LinearGradient
              colors={isDark 
                ? ['rgba(59, 130, 246, 0.15)', 'rgba(16, 185, 129, 0.08)'] 
                : ['rgba(59, 130, 246, 0.08)', 'rgba(16, 185, 129, 0.04)']}
              style={styles.totalGradient}
            />
            <View style={styles.totalCardContent}>
              <BlurView intensity={40} tint={isDark ? 'dark' : 'light'} style={styles.totalLabelContainer}>
                <Text style={[styles.totalLabel, { color: theme.colors.textSecondary }]}>Monthly Total</Text>
              </BlurView>
              <Text style={[styles.totalAmount, { color: theme.colors.text }]}>${totalMonthly.toFixed(2)}</Text>
              <BlurView intensity={30} tint={isDark ? 'dark' : 'light'} style={styles.totalSubtextContainer}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Sparkles size={14} color={theme.colors.primary} />
                  <Text style={[styles.totalSubtext, { color: theme.colors.textSecondary }]}>
                    Across {subscriptions.length} subscriptions
                  </Text>
                </View>
              </BlurView>
            </View>
          </BlurView>
        </View>

        {/* Subscriptions List */}
        <View style={styles.subscriptionsList}>
          {subscriptions.length >= 3 && !isPremium && (
            <View style={styles.premiumLockContainer}>
              <PremiumLock message="Track unlimited subscriptions + get AI price alerts with Premium" />
            </View>
          )}
          
          {subscriptions.length > 0 ? (
            subscriptions.slice(0, isPremium ? subscriptions.length : 3).map((subscription) => (
            <BlurView key={subscription.id} intensity={70} tint={isDark ? 'dark' : 'light'} style={styles.subscriptionCard}>
              <View style={styles.subscriptionCardContent}>
                <View style={styles.subscriptionLeft}>
                  <BlurView intensity={50} tint={isDark ? 'dark' : 'light'} style={styles.subscriptionIconContainer}>
                    <View style={[styles.subscriptionIcon, { backgroundColor: subscription.color }]}>
                      <Text style={styles.subscriptionIconText}>
                        {subscription.name.charAt(0)}
                      </Text>
                    </View>
                  </BlurView>
                  <View style={styles.subscriptionInfo}>
                    <Text style={[styles.subscriptionName, { color: theme.colors.text }]}>{subscription.name}</Text>
                    <BlurView intensity={30} tint={isDark ? 'dark' : 'light'} style={styles.categoryContainer}>
                      <Text style={[styles.subscriptionCategory, { color: theme.colors.textSecondary }]}>{subscription.category}</Text>
                    </BlurView>
                  </View>
                </View>
                <View style={styles.subscriptionRight}>
                  <BlurView intensity={40} tint={isDark ? 'dark' : 'light'} style={styles.amountContainer}>
                    <Text style={[styles.subscriptionAmount, { color: theme.colors.text }]}>${subscription.amount}</Text>
                  </BlurView>
                  <View style={styles.renewalInfo}>
                    <Calendar size={14} color={theme.colors.textSecondary} />
                    <Text style={[styles.renewalDate, { color: theme.colors.textSecondary }]}>{formatDate(subscription.renewDate)}</Text>
                  </View>
                  <BlurView intensity={40} tint={isDark ? 'dark' : 'light'} style={styles.deleteButton}>
                    <TouchableOpacity 
                      style={styles.deleteButtonContent}
                      onPress={() => handleDeleteSubscription(subscription.id, subscription.name)}
                    >
                      <Trash2 size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </BlurView>
                </View>
              </View>
            </BlurView>
            ))
          ) : (
            <BlurView intensity={60} tint={isDark ? 'dark' : 'light'} style={styles.noSubscriptions}>
              <LinearGradient
                colors={isDark 
                  ? ['rgba(59, 130, 246, 0.1)', 'rgba(59, 130, 246, 0.05)'] 
                  : ['rgba(59, 130, 246, 0.05)', 'rgba(59, 130, 246, 0.02)']}
                style={styles.noSubscriptionsGradient}
              />
              <View style={styles.noSubscriptionsContent}>
                <BlurView intensity={40} tint={isDark ? 'dark' : 'light'} style={styles.emptyIconContainer}>
                  <Plus size={32} color={theme.colors.primary} />
                </BlurView>
                <Text style={[styles.noSubscriptionsTitle, { color: theme.colors.text }]}>No subscriptions yet</Text>
                <Text style={[styles.noSubscriptionsText, { color: theme.colors.textSecondary }]}>
                  Add your first subscription to start tracking renewals
                </Text>
              </View>
            </BlurView>
          )}
        </View>

        {/* Insights Section */}
        {subscriptions.length > 0 && (
          <View style={styles.insightsSection}>
            <Text style={[styles.insightsTitle, { color: theme.colors.text }]}>This Month</Text>
            
            <BlurView intensity={50} tint={isDark ? 'dark' : 'light'} style={styles.insightCard}>
              <View style={styles.insightCardContent}>
                <Text style={[styles.insightText, { color: theme.colors.text }]}>
                  You're spending <Text style={styles.insightHighlight}>${totalMonthly.toFixed(2)}</Text> monthly on subscriptions
                </Text>
                <Text style={[styles.insightSubtext, { color: theme.colors.textSecondary }]}>
                  Across {subscriptions.length} subscription{subscriptions.length !== 1 ? 's' : ''}
                </Text>
              </View>
            </BlurView>
            
            <BlurView intensity={50} tint={isDark ? 'dark' : 'light'} style={styles.insightCard}>
              <View style={styles.insightCardContent}>
                <Text style={[styles.insightText, { color: theme.colors.text }]}>
                  <Text style={styles.insightHighlight}>{subscriptions.length} subscription{subscriptions.length !== 1 ? 's' : ''}</Text> tracked
                </Text>
                <Text style={[styles.insightSubtext, { color: theme.colors.textSecondary }]}>
                  Stay on top of your recurring expenses
                </Text>
              </View>
            </BlurView>
          </View>
        )}

        {/* Add Subscription Modal */}
        <AddSubscriptionModal 
          visible={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAdd={refreshSubscriptions}
          canAdd={canAddMore}
        />
      </ScrollView>
    </View>
  );
}

function AddSubscriptionModal({ visible, onClose, onAdd, canAdd }: {
  visible: boolean;
  onClose: () => void;
  onAdd: () => void;
  canAdd: boolean;
}) {
  const { theme } = useTheme();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [renewalDate, setRenewalDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [saving, setSaving] = useState(false);

  const { addSubscription } = useSubscriptions();

  const categories = ['Entertainment', 'Music', 'Productivity', 'Design', 'News', 'Fitness', 'Other'];
  const colors = ['#1DB954', '#E50914', '#FF0000', '#000000', '#3B82F6', '#10B981', '#F59E0B'];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };
  const handleSave = async () => {
    if (name && amount && category && !saving && canAdd) {
      setSaving(true);
      try {
        await addSubscription({
          name,
          amount: parseFloat(amount),
          category,
          renewDate: renewalDate.toISOString(),
          color: colors[Math.floor(Math.random() * colors.length)],
        });
        
        setName('');
        setAmount('');
        setCategory('');
        setRenewalDate(new Date());
        
        onAdd();
        onClose();
      } catch (error) {
        console.error('Error saving subscription:', error);
      } finally {
        setSaving(false);
      }
    }
  };

  return (
    <Modal visible={visible} transparent animationType="none">
      <View style={styles.modalOverlay}>
        <BlurView intensity={80} tint={theme.isDark ? 'dark' : 'light'} style={styles.addModalContent}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.95)', 'rgba(248, 250, 252, 0.9)']}
            style={styles.modalGradient}
          />
          <View style={styles.addModalHeader}>
            <Text style={[styles.addModalTitle, { color: theme.colors.text }]}>Add Subscription</Text>
            <BlurView intensity={40} tint={theme.isDark ? 'dark' : 'light'} style={styles.closeButtonContainer}>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X size={24} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </BlurView>
          </View>
          
          <View style={styles.addModalForm}>
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Service Name</Text>
              <BlurView intensity={30} tint="light" style={styles.inputContainer}>
                <TextInput
                  style={[styles.textInput, { color: theme.colors.text }]}
                  value={name}
                  onChangeText={setName}
                  placeholder="e.g., Netflix, Spotify"
                  placeholderTextColor={theme.colors.textSecondary}
                />
              </BlurView>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Monthly Amount</Text>
              <BlurView intensity={30} tint="light" style={styles.inputContainer}>
                <TextInput
                  style={[styles.textInput, { color: theme.colors.text }]}
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="0.00"
                  keyboardType="numeric"
                  placeholderTextColor={theme.colors.textSecondary}
                />
              </BlurView>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                {categories.map((cat) => (
                  <BlurView key={cat} intensity={category === cat ? 60 : 30} tint="light" style={styles.categoryChip}>
                    <TouchableOpacity
                      style={styles.categoryChipContent}
                      onPress={() => setCategory(cat)}
                    >
                      {category === cat && (
                        <LinearGradient
                          colors={['#3B82F6', '#1D4ED8']}
                          style={styles.categoryActiveGradient}
                        />
                      )}
                      <Text style={[
                        styles.categoryChipText, 
                        { color: category === cat ? '#FFFFFF' : theme.colors.textSecondary }
                      ]}>
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  </BlurView>
                ))}
              </ScrollView>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Next Payment Date</Text>
              <BlurView intensity={30} tint="light" style={styles.inputContainer}>
                <TouchableOpacity
                  style={styles.datePickerButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Calendar size={20} color={theme.colors.primary} />
                  <Text style={[styles.datePickerText, { color: theme.colors.text }]}>
                    {formatDate(renewalDate)}
                  </Text>
                </TouchableOpacity>
              </BlurView>
            </View>
          </View>
          
          <BlurView intensity={60} tint={theme.isDark ? 'dark' : 'light'} style={styles.saveSubscriptionButton}>
            <TouchableOpacity
              style={[styles.saveButtonContent, (!name || !amount || !category || saving) && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={!name || !amount || !category || saving}
            >
              <LinearGradient
                colors={(!name || !amount || !category || saving) 
                  ? ['#CBD5E1', '#94A3B8'] 
                  : ['#3B82F6', '#1D4ED8']}
                style={styles.saveButtonGradient}
              />
              <Text style={styles.saveSubscriptionButtonText}>
                {saving ? 'Adding...' : 'Add Subscription'}
              </Text>
            </TouchableOpacity>
          </BlurView>
        </BlurView>
        
        {/* Date Picker Modal */}
        <Modal visible={showDatePicker} transparent animationType="fade">
          <View style={styles.datePickerOverlay}>
            <BlurView intensity={80} tint="light" style={styles.datePickerModal}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.95)', 'rgba(248, 250, 252, 0.9)']}
                style={styles.datePickerGradient}
              />
              <View style={styles.datePickerHeader}>
                <Text style={[styles.datePickerTitle, { color: theme.colors.text }]}>Select Payment Date</Text>
                <BlurView intensity={40} tint="light" style={styles.closeButtonContainer}>
                  <TouchableOpacity onPress={() => setShowDatePicker(false)} style={styles.closeButton}>
                    <X size={24} color={theme.colors.textSecondary} />
                  </TouchableOpacity>
                </BlurView>
              </View>
              
              <View style={styles.datePickerContent}>
                <Text style={[styles.datePickerLabel, { color: theme.colors.textSecondary }]}>
                  Choose when this subscription renews
                </Text>
                
                <View style={styles.dateOptions}>
                  {[7, 14, 30, 60, 90].map((days) => {
                    const futureDate = new Date();
                    futureDate.setDate(futureDate.getDate() + days);
                    const isSelected = Math.abs(renewalDate.getTime() - futureDate.getTime()) < 24 * 60 * 60 * 1000;
                    
                    return (
                      <BlurView key={days} intensity={isSelected ? 60 : 30} tint="light" style={styles.dateOption}>
                        <TouchableOpacity
                          style={styles.dateOptionContent}
                          onPress={() => {
                            setRenewalDate(futureDate);
                            setShowDatePicker(false);
                          }}
                        >
                          {isSelected && (
                            <LinearGradient
                              colors={['#3B82F6', '#1D4ED8']}
                              style={styles.dateOptionGradient}
                            />
                          )}
                          <Text style={[
                            styles.dateOptionDays,
                            { color: isSelected ? '#FFFFFF' : theme.colors.text }
                          ]}>
                            {days === 7 ? 'Next week' : days === 14 ? '2 weeks' : days === 30 ? 'Next month' : days === 60 ? '2 months' : '3 months'}
                          </Text>
                          <Text style={[
                            styles.dateOptionDate,
                            { color: isSelected ? 'rgba(255, 255, 255, 0.8)' : theme.colors.textSecondary }
                          ]}>
                            {formatDate(futureDate)}
                          </Text>
                        </TouchableOpacity>
                      </BlurView>
                    );
                  })}
                </View>
              </View>
            </BlurView>
          </View>
        </Modal>
      </View>
    </Modal>
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
  scrollContent: {
    paddingBottom: 120,
  },
  headerBlur: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitleContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  subtitle: {
    fontSize: 14,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  addButton: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  addButtonContent: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  addButtonIconContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  heroSection: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 32,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  totalCard: {
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 32,
    elevation: 12,
  },
  totalGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  totalCardContent: {
    padding: 40,
    alignItems: 'center',
  },
  totalLabelContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '600',
    paddingHorizontal: 20,
    paddingVertical: 8,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    opacity: 0.8,
  },
  totalAmount: {
    fontSize: 56,
    fontWeight: '900',
    marginBottom: 20,
    letterSpacing: -1.5,
  },
  totalSubtextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    overflow: 'hidden',
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  totalSubtext: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  subscriptionsList: {
    paddingHorizontal: 24,
    gap: 16,
  },
  premiumLockContainer: {
    marginBottom: 16,
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
  subscriptionCardContent: {
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
    gap: 6,
  },
  subscriptionName: {
    fontSize: 18,
    fontWeight: '600',
  },
  categoryContainer: {
    alignSelf: 'flex-start',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  subscriptionCategory: {
    fontSize: 14,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  subscriptionRight: {
    alignItems: 'flex-end',
    gap: 8,
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
    paddingVertical: 6,
  },
  renewalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  renewalDate: {
    fontSize: 12,
  },
  deleteButton: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    marginTop: 4,
  },
  deleteButtonContent: {
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noSubscriptions: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 24,
    elevation: 4,
  },
  noSubscriptionsGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  noSubscriptionsContent: {
    padding: 40,
    alignItems: 'center',
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  noSubscriptionsTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  noSubscriptionsText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  addFirstButton: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  addFirstButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  addFirstGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  addFirstButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  insightsSection: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    paddingBottom: 100,
  },
  insightsTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
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
  insightCardContent: {
    padding: 20,
  },
  insightText: {
    fontSize: 16,
    marginBottom: 4,
    lineHeight: 24,
  },
  insightHighlight: {
    fontWeight: '600',
    color: '#3B82F6',
  },
  insightSubtext: {
    fontSize: 14,
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  addModalContent: {
    borderRadius: 24,
    paddingBottom: 40,
    maxHeight: '80%',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  modalGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  addModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  addModalTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  closeButtonContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  closeButton: {
    padding: 8,
  },
  addModalForm: {
    padding: 24,
    gap: 24,
  },
  inputGroup: {
    gap: 12,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  inputContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  textInput: {
    padding: 16,
    fontSize: 16,
  },
  categoryScroll: {
    flexDirection: 'row',
  },
  categoryChip: {
    borderRadius: 20,
    marginRight: 12,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  categoryChipContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  categoryActiveGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  saveSubscriptionButton: {
    marginHorizontal: 24,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  saveButtonContent: {
    padding: 20,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  saveSubscriptionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  datePickerText: {
    fontSize: 16,
    fontWeight: '500',
  },
  datePickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  datePickerModal: {
    borderRadius: 24,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.2,
    shadowRadius: 32,
    elevation: 16,
  },
  datePickerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  datePickerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  datePickerContent: {
    padding: 24,
  },
  datePickerLabel: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  dateOptions: {
    gap: 12,
  },
  dateOption: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  dateOptionContent: {
    padding: 16,
    alignItems: 'center',
  },
  dateOptionGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  dateOptionDays: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  dateOptionDate: {
    fontSize: 14,
  },
});