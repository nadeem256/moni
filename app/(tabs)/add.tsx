import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useState } from 'react';
import { X, DollarSign, ArrowUp, ArrowDown, Sparkles, Calendar } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { useTransactions } from '../../hooks/useData';
import { router } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

export default function AddScreen() {
  const [amount, setAmount] = useState('');
  const [selectedType, setSelectedType] = useState<'income' | 'expense'>('expense');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    return date;
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { addTransaction } = useTransactions();
  const { theme, isDark } = useTheme();

  const categories = {
    expense: ['Food & Dining', 'Transportation', 'Shopping', 'Entertainment', 'Bills', 'Health', 'Other'],
    income: ['Salary', 'Freelance', 'Investment', 'Gift', 'Other']
  };

  const handleSave = async () => {
    const numericAmount = parseFloat(amount);
    if (amount && selectedCategory && !saving && !isNaN(numericAmount) && numericAmount > 0) {
      setSaving(true);
      try {
        const dateToSave = new Date(selectedDate);
        dateToSave.setHours(12, 0, 0, 0);

        await addTransaction({
          amount: numericAmount,
          type: selectedType,
          category: selectedCategory,
          date: dateToSave.toISOString(),
          description: description || undefined,
        });
        
        setAmount('');
        setSelectedCategory('');
        setDescription('');
        const resetDate = new Date();
        resetDate.setHours(12, 0, 0, 0);
        setSelectedDate(resetDate);

        router.push('/(tabs)');
      } catch (error) {
        console.error('Error saving transaction:', error);
      } finally {
        setSaving(false);
      }
    }
  };

  const handleTypeChange = (type: 'income' | 'expense') => {
    setSelectedType(type);
    if (selectedCategory) {
      setAmount('');
      setSelectedCategory('');
    }
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const DatePickerModal = () => {
    const [tempDate, setTempDate] = useState(() => {
      const date = new Date(selectedDate);
      date.setHours(12, 0, 0, 0);
      return date;
    });
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 10 }, (_, i) => currentYear - i);
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const daysInMonth = new Date(tempDate.getFullYear(), tempDate.getMonth() + 1, 0).getDate();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    return (
      <Modal visible={showDatePicker} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <BlurView intensity={80} tint={isDark ? 'dark' : 'light'} style={styles.dateModalContent}>
            <LinearGradient
              colors={isDark
               ? ['rgba(26, 26, 46, 0.95)', 'rgba(22, 33, 62, 0.9)']
                : ['rgba(255, 255, 255, 0.95)', 'rgba(248, 250, 252, 0.9)']}
              style={styles.modalGradient}
            />
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Select Date</Text>
              <BlurView intensity={40} tint={isDark ? 'dark' : 'light'} style={styles.closeButtonContainer}>
                <TouchableOpacity onPress={() => setShowDatePicker(false)} style={styles.closeButton}>
                  <X size={24} color={theme.colors.textSecondary} />
                </TouchableOpacity>
              </BlurView>
            </View>

            <View style={styles.datePickerContent}>
              <View style={styles.datePickerRow}>
                <View style={styles.datePickerColumn}>
                  <Text style={[styles.datePickerLabel, { color: theme.colors.textSecondary }]}>Month</Text>
                  <ScrollView style={styles.datePickerScroll} showsVerticalScrollIndicator={false}>
                    {months.map((month, index) => (
                      <TouchableOpacity
                        key={month}
                        onPress={() => {
                          const newDate = new Date(tempDate);
                          newDate.setMonth(index);
                          newDate.setHours(12, 0, 0, 0);
                          setTempDate(newDate);
                        }}
                        style={[
                          styles.datePickerOption,
                          tempDate.getMonth() === index && styles.datePickerOptionSelected
                        ]}
                      >
                        <Text style={[
                          styles.datePickerOptionText,
                          { color: tempDate.getMonth() === index ? theme.colors.primary : theme.colors.text }
                        ]}>
                          {month}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                <View style={styles.datePickerColumn}>
                  <Text style={[styles.datePickerLabel, { color: theme.colors.textSecondary }]}>Day</Text>
                  <ScrollView style={styles.datePickerScroll} showsVerticalScrollIndicator={false}>
                    {days.map((day) => (
                      <TouchableOpacity
                        key={day}
                        onPress={() => {
                          const newDate = new Date(tempDate);
                          newDate.setDate(day);
                          newDate.setHours(12, 0, 0, 0);
                          setTempDate(newDate);
                        }}
                        style={[
                          styles.datePickerOption,
                          tempDate.getDate() === day && styles.datePickerOptionSelected
                        ]}
                      >
                        <Text style={[
                          styles.datePickerOptionText,
                          { color: tempDate.getDate() === day ? theme.colors.primary : theme.colors.text }
                        ]}>
                          {day}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                <View style={styles.datePickerColumn}>
                  <Text style={[styles.datePickerLabel, { color: theme.colors.textSecondary }]}>Year</Text>
                  <ScrollView style={styles.datePickerScroll} showsVerticalScrollIndicator={false}>
                    {years.map((year) => (
                      <TouchableOpacity
                        key={year}
                        onPress={() => {
                          const newDate = new Date(tempDate);
                          newDate.setFullYear(year);
                          newDate.setHours(12, 0, 0, 0);
                          setTempDate(newDate);
                        }}
                        style={[
                          styles.datePickerOption,
                          tempDate.getFullYear() === year && styles.datePickerOptionSelected
                        ]}
                      >
                        <Text style={[
                          styles.datePickerOptionText,
                          { color: tempDate.getFullYear() === year ? theme.colors.primary : theme.colors.text }
                        ]}>
                          {year}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.dateConfirmButton, { backgroundColor: theme.colors.primary }]}
                onPress={() => {
                  setSelectedDate(tempDate);
                  setShowDatePicker(false);
                }}
              >
                <Text style={styles.dateConfirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </BlurView>
        </View>
      </Modal>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.colors.background }]} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={isDark ? ['#0F0F23', '#1A1A2E', '#16213E'] : ['#F8FAFC', '#E2E8F0', '#CBD5E1']}
        style={styles.backgroundGradient}
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Type Selection */}
        <View style={styles.typeSection}>
          <View style={styles.headerContent}>
            <Text style={[styles.title, { color: theme.colors.text }]}>Add Transaction</Text>
            <BlurView intensity={40} tint={isDark ? 'dark' : 'light'} style={styles.sparkleContainer}>
              <Sparkles size={20} color={theme.colors.primary} />
            </BlurView>
          </View>
          
          <Text style={[styles.sectionLabel, { color: theme.colors.text }]}>Transaction Type</Text>
          <View style={styles.typeSelection}>
            <BlurView 
              intensity={selectedType === 'expense' ? 80 : 40}
              tint={isDark ? 'dark' : 'light'}
              style={[styles.typeButton, selectedType === 'expense' && styles.typeButtonActive]}
            >
              <TouchableOpacity
                style={styles.typeButtonContent}
                onPress={() => handleTypeChange('expense')}
              >
                {selectedType === 'expense' && (
                  <LinearGradient
                    colors={['#EF4444', '#DC2626']}
                    style={styles.typeButtonGradient}
                  />
                )}
                <View style={styles.typeButtonContentInner}>
                  <ArrowDown size={20} color={selectedType === 'expense' ? '#FFFFFF' : '#EF4444'} />
                  <Text style={[
                    styles.typeButtonText, 
                    { color: selectedType === 'expense' ? '#FFFFFF' : theme.colors.textSecondary }
                  ]}>
                    Expense
                  </Text>
                </View>
              </TouchableOpacity>
            </BlurView>
            
            <BlurView 
              intensity={selectedType === 'income' ? 80 : 40}
              tint={isDark ? 'dark' : 'light'}
              style={[styles.typeButton, selectedType === 'income' && styles.typeButtonActive]}
            >
              <TouchableOpacity
                style={styles.typeButtonContent}
                onPress={() => handleTypeChange('income')}
              >
                {selectedType === 'income' && (
                  <LinearGradient
                    colors={['#34D399', '#10B981']}
                    style={styles.typeButtonGradient}
                  />
                )}
                <View style={styles.typeButtonContentInner}>
                  <ArrowUp size={20} color={selectedType === 'income' ? '#FFFFFF' : '#34D399'} />
                  <Text style={[
                    styles.typeButtonText, 
                    { color: selectedType === 'income' ? '#FFFFFF' : theme.colors.textSecondary }
                  ]}>
                    Income
                  </Text>
                </View>
              </TouchableOpacity>
            </BlurView>
          </View>
        </View>

        {/* Amount Input */}
        <View style={styles.amountSection}>
          <Text style={[styles.sectionLabel, { color: theme.colors.text }]}>Amount</Text>
          <BlurView intensity={80} tint={isDark ? 'dark' : 'light'} style={styles.amountCard}>
            <LinearGradient
              colors={isDark 
                ? ['rgba(26, 26, 46, 0.9)', 'rgba(22, 33, 62, 0.7)'] 
                : ['rgba(59, 130, 246, 0.05)', 'rgba(59, 130, 246, 0.02)']}
              style={styles.amountGradient}
            />
            <View style={styles.amountInputContent}>
              <BlurView intensity={40} tint={isDark ? 'dark' : 'light'} style={styles.dollarContainer}>
                <DollarSign size={32} color={theme.colors.primary} />
              </BlurView>
              <TextInput
                style={[styles.amountText, { color: theme.colors.text }]}
                value={amount}
                onChangeText={setAmount}
                placeholder="0.00"
                keyboardType="numeric"
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>
          </BlurView>
        </View>

        {/* Date Selection */}
        <View style={styles.dateSection}>
          <Text style={[styles.sectionLabel, { color: theme.colors.text }]}>Date</Text>
          <BlurView intensity={60} tint={isDark ? 'dark' : 'light'} style={styles.dateButton}>
            <LinearGradient
              colors={isDark
               ? ['rgba(26, 26, 46, 0.8)', 'rgba(22, 33, 62, 0.6)']
                : ['rgba(255, 255, 255, 0.8)', 'rgba(248, 250, 252, 0.6)']}
              style={styles.dateButtonGradient}
            />
            <TouchableOpacity
              style={styles.dateButtonContent}
              onPress={() => setShowDatePicker(true)}
            >
              <View style={styles.dateButtonLeft}>
                <BlurView intensity={40} tint={isDark ? 'dark' : 'light'} style={styles.calendarIcon}>
                  <Calendar size={20} color={theme.colors.primary} />
                </BlurView>
                <Text style={[styles.dateButtonText, { color: theme.colors.text }]}>
                  {formatDate(selectedDate)}
                </Text>
              </View>
              <BlurView intensity={30} tint={isDark ? 'dark' : 'light'} style={styles.dateArrow}>
                <Text style={[styles.dateArrowText, { color: theme.colors.textSecondary }]}>›</Text>
              </BlurView>
            </TouchableOpacity>
          </BlurView>
        </View>

        {/* Category Selection */}
        <View style={styles.categorySection}>
          <Text style={[styles.sectionLabel, { color: theme.colors.text }]}>Category</Text>
          <BlurView intensity={60} tint={isDark ? 'dark' : 'light'} style={styles.categoryButton}>
            <LinearGradient
              colors={isDark 
               ? ['rgba(26, 26, 46, 0.8)', 'rgba(22, 33, 62, 0.6)'] 
                : ['rgba(255, 255, 255, 0.8)', 'rgba(248, 250, 252, 0.6)']}
              style={styles.categoryButtonGradient}
            />
            <TouchableOpacity
              style={styles.categoryButtonContent}
              onPress={() => setShowCategoryModal(true)}
            >
              <Text style={[
                styles.categoryButtonText, 
                { color: selectedCategory ? theme.colors.text : theme.colors.textSecondary }
              ]}>
                {selectedCategory || 'Select Category'}
              </Text>
              <BlurView intensity={30} tint={isDark ? 'dark' : 'light'} style={styles.categoryArrow}>
                <Text style={[styles.categoryArrowText, { color: theme.colors.textSecondary }]}>›</Text>
              </BlurView>
            </TouchableOpacity>
          </BlurView>
        </View>

        {/* Description Input */}
        <View style={styles.descriptionSection}>
          <Text style={[styles.sectionLabel, { color: theme.colors.text }]}>Description (Optional)</Text>
          <BlurView intensity={50} tint={isDark ? 'dark' : 'light'} style={styles.descriptionInput}>
            <LinearGradient
              colors={isDark 
               ? ['rgba(26, 26, 46, 0.8)', 'rgba(22, 33, 62, 0.6)'] 
                : ['rgba(255, 255, 255, 0.8)', 'rgba(248, 250, 252, 0.6)']}
              style={styles.descriptionInputGradient}
            />
            <TextInput
              style={[styles.descriptionInputText, { color: theme.colors.text }]}
              value={description}
              onChangeText={setDescription}
              placeholder="Add a note..."
              placeholderTextColor={theme.colors.textSecondary}
              multiline
            />
          </BlurView>
        </View>

        {/* Save Button */}
        <BlurView intensity={80} tint={isDark ? 'dark' : 'light'} style={styles.saveButton}>
          <LinearGradient
            colors={isDark 
             ? ['rgba(26, 26, 46, 0.9)', 'rgba(22, 33, 62, 0.7)'] 
              : ['rgba(255, 255, 255, 0.9)', 'rgba(248, 250, 252, 0.7)']}
            style={styles.saveButtonBackgroundGradient}
          />
          <TouchableOpacity 
            style={[styles.saveButtonContent, (!amount || !selectedCategory || saving) && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={!amount || !selectedCategory || saving}
          >
            <LinearGradient
              colors={(!amount || !selectedCategory || saving) 
                ? ['#CBD5E1', '#94A3B8'] 
                : ['#3B82F6', '#1D4ED8']}
              style={styles.saveButtonGradient}
            />
            <Text style={styles.saveButtonText}>
              {saving ? 'Saving...' : 'Save Transaction'}
            </Text>
          </TouchableOpacity>
        </BlurView>
      </ScrollView>

      {/* Date Picker Modal */}
      <DatePickerModal />

      {/* Category Modal */}
      <Modal visible={showCategoryModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <BlurView intensity={80} tint={isDark ? 'dark' : 'light'} style={styles.modalContent}>
            <LinearGradient
              colors={isDark 
               ? ['rgba(26, 26, 46, 0.95)', 'rgba(22, 33, 62, 0.9)'] 
                : ['rgba(255, 255, 255, 0.95)', 'rgba(248, 250, 252, 0.9)']}
              style={styles.modalGradient}
            />
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Select Category</Text>
              <BlurView intensity={40} tint={isDark ? 'dark' : 'light'} style={styles.closeButtonContainer}>
                <TouchableOpacity onPress={() => setShowCategoryModal(false)} style={styles.closeButton}>
                  <X size={24} color={theme.colors.textSecondary} />
                </TouchableOpacity>
              </BlurView>
            </View>
            <ScrollView style={styles.categoriesList}>
              {categories[selectedType].map((category, index) => (
                <BlurView key={index} intensity={30} tint={isDark ? 'dark' : 'light'} style={styles.categoryOption}>
                  <LinearGradient
                    colors={isDark 
                     ? ['rgba(26, 26, 46, 0.7)', 'rgba(22, 33, 62, 0.5)'] 
                      : ['rgba(255, 255, 255, 0.8)', 'rgba(248, 250, 252, 0.6)']}
                    style={styles.categoryOptionGradient}
                  />
                  <TouchableOpacity
                    style={styles.categoryOptionContent}
                    onPress={() => {
                      setSelectedCategory(category);
                      setShowCategoryModal(false);
                    }}
                  >
                    <Text style={[styles.categoryOptionText, { color: theme.colors.text }]}>{category}</Text>
                  </TouchableOpacity>
                </BlurView>
              ))}
            </ScrollView>
          </BlurView>
        </View>
      </Modal>
    </KeyboardAvoidingView>
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
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  headerBlur: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sparkleContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  typeSection: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 32,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  typeSelection: {
    flexDirection: 'row',
    gap: 16,
  },
  typeButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  typeButtonActive: {
    shadowColor: '#3B82F6',
    shadowOpacity: 0.2,
    elevation: 8,
  },
  typeButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 12,
  },
  typeButtonGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  typeButtonContentInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    zIndex: 2,
  },
  amountSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  amountCard: {
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
  amountGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  amountInputContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 40,
    gap: 20,
  },
  dollarContainer: {
    padding: 16,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.4)',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  amountText: {
    flex: 1,
    fontSize: 42,
    fontWeight: '800',
    letterSpacing: -1.2,
  },
  dateSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  dateButton: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  dateButtonGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  dateButtonContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  dateButtonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  calendarIcon: {
    padding: 8,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  dateButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  dateArrow: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  dateArrowText: {
    fontSize: 18,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  dateModalContent: {
    borderRadius: 24,
    maxHeight: '80%',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.2,
    shadowRadius: 32,
    elevation: 16,
  },
  datePickerContent: {
    padding: 24,
  },
  datePickerRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  datePickerColumn: {
    flex: 1,
  },
  datePickerLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  datePickerScroll: {
    maxHeight: 200,
  },
  datePickerOption: {
    padding: 12,
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 8,
  },
  datePickerOptionSelected: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  datePickerOptionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  dateConfirmButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  dateConfirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  categorySection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  categoryButton: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  categoryButtonGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  categoryButtonContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  categoryButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  categoryArrow: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  categoryArrowText: {
    fontSize: 18,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  descriptionSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  descriptionInput: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  descriptionInputGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  descriptionInputText: {
    padding: 20,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginHorizontal: 24,
    borderWidth: 0.5,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  saveButtonBackgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
  saveButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalContent: {
    borderRadius: 24,
    maxHeight: '70%',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.2,
    shadowRadius: 32,
    elevation: 16,
  },
  modalGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalTitle: {
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
  categoriesList: {
    padding: 24,
  },
  categoryOption: {
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  categoryOptionGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  categoryOptionContent: {
    padding: 16,
  },
  categoryOptionText: {
    fontSize: 16,
    fontWeight: '500',
  },
});