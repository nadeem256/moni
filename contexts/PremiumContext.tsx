import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// RevenueCat imports (uncomment when SDK is installed)
// import Purchases, { CustomerInfo, PurchasesOffering } from 'react-native-purchases';

interface PremiumContextType {
  isPremium: boolean;
  isLoading: boolean;
  purchasePremium: () => Promise<void>;
  restorePurchases: () => Promise<void>;
  cancelSubscription: () => Promise<void>;
}

const PremiumContext = createContext<PremiumContextType | undefined>(undefined);

export const usePremium = () => {
  const context = useContext(PremiumContext);
  if (!context) {
    throw new Error('usePremium must be used within a PremiumProvider');
  }
  return context;
};

interface PremiumProviderProps {
  children: ReactNode;
}

// RevenueCat Configuration
const API_KEY = "YOUR_REVENUECAT_API_KEY_HERE"; // Replace with your actual API key
const PREMIUM_ENTITLEMENT = "premium";
const PREMIUM_PRODUCT_ID = "premium_monthly";

export const PremiumProvider: React.FC<PremiumProviderProps> = ({ children }) => {
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    initializeRevenueCat();
  }, []);

  const initializeRevenueCat = async () => {
    try {
      // DEMO MODE - Remove this section when RevenueCat SDK is installed
      console.log('🔧 DEMO MODE: Using simulated RevenueCat');
      console.log('📋 To enable real purchases:');
      console.log('1. Install: npm install react-native-purchases');
      console.log('2. Replace API_KEY with your RevenueCat key');
      console.log('3. Uncomment RevenueCat code below');
      
      await loadPremiumStatus();
      
      /* REAL REVENUECAT CODE - Uncomment when SDK is installed
      
      // Initialize RevenueCat
      await Purchases.setLogLevel(Purchases.LOG_LEVEL.INFO);
      
      if (Platform.OS === 'ios') {
        await Purchases.configure({ apiKey: API_KEY });
      } else if (Platform.OS === 'android') {
        await Purchases.configure({ apiKey: API_KEY });
      }
      
      // Set up listener for purchase updates
      Purchases.addCustomerInfoUpdateListener((customerInfo) => {
        updatePremiumStatus(customerInfo);
      });
      
      // Check current subscription status
      const customerInfo = await Purchases.getCustomerInfo();
      updatePremiumStatus(customerInfo);
      
      */
      
    } catch (error) {
      console.error('Error initializing RevenueCat:', error);
      await loadPremiumStatus(); // Fallback to local storage
    }
  };

  const loadPremiumStatus = async () => {
    try {
      const premiumStatus = await AsyncStorage.getItem('isPremium');
      setIsPremium(premiumStatus === 'true');
    } catch (error) {
      console.error('Error loading premium status:', error);
    }
  };

  /* REAL REVENUECAT FUNCTIONS - Uncomment when SDK is installed
  
  const updatePremiumStatus = (customerInfo: CustomerInfo) => {
    const hasEntitlement = customerInfo.entitlements.active[PREMIUM_ENTITLEMENT] !== undefined;
    setIsPremium(hasEntitlement);
    
    // Also save to local storage for offline access
    AsyncStorage.setItem('isPremium', hasEntitlement.toString());
  };
  
  */

  const purchasePremium = async () => {
    try {
      setIsLoading(true);
      
      // DEMO MODE - Remove when RevenueCat SDK is installed
      console.log('🔧 DEMO MODE: Simulating purchase...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      await AsyncStorage.setItem('isPremium', 'true');
      setIsPremium(true);
      console.log('✅ Demo purchase successful!');
      return;
      
      /* REAL REVENUECAT PURCHASE - Uncomment when SDK is installed
      
      // Get available offerings
      const offerings = await Purchases.getOfferings();
      const currentOffering = offerings.current;
      
      if (!currentOffering) {
        throw new Error('No offerings available');
      }
      
      // Find the premium monthly product
      const premiumProduct = currentOffering.monthly?.product || 
                           currentOffering.availablePackages.find(
                             pkg => pkg.product.identifier === PREMIUM_PRODUCT_ID
                           );
      
      if (!premiumProduct) {
        throw new Error('Premium product not found');
      }
      
      // Make the purchase
      const { customerInfo } = await Purchases.purchaseProduct(premiumProduct.product);
      updatePremiumStatus(customerInfo);
      
      */
      
    } catch (error) {
      console.error('Error purchasing premium:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const restorePurchases = async () => {
    try {
      setIsLoading(true);
      
      // DEMO MODE - Remove when RevenueCat SDK is installed
      console.log('🔧 DEMO MODE: Simulating restore...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      const premiumStatus = await AsyncStorage.getItem('isPremium');
      const hasPremium = premiumStatus === 'true';
      setIsPremium(hasPremium);
      console.log(hasPremium ? '✅ Demo restore successful!' : 'No premium subscription found');
      return;
      
      /* REAL REVENUECAT RESTORE - Uncomment when SDK is installed
      
      const customerInfo = await Purchases.restorePurchases();
      updatePremiumStatus(customerInfo);
      
      */
      
    } catch (error) {
      console.error('Error restoring purchases:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelSubscription = async () => {
    try {
      setIsLoading(true);
      
      // DEMO MODE - Remove when RevenueCat SDK is installed
      console.log('🔧 DEMO MODE: Simulating cancellation...');
      await AsyncStorage.setItem('isPremium', 'false');
      setIsPremium(false);
      console.log('✅ Demo cancellation successful!');
      return;
      
      /* REAL REVENUECAT CANCELLATION - Uncomment when SDK is installed
      
      // Note: RevenueCat doesn't directly cancel subscriptions
      // Users need to cancel through App Store/Google Play
      // This function would typically redirect users to manage subscriptions
      
      const customerInfo = await Purchases.getCustomerInfo();
      updatePremiumStatus(customerInfo);
      
      // You might want to show instructions to cancel in App Store/Google Play
      
      */
      
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PremiumContext.Provider
      value={{
        isPremium,
        isLoading,
        purchasePremium,
        restorePurchases,
        cancelSubscription,
      }}
    >
      {children}
    </PremiumContext.Provider>
  );
};