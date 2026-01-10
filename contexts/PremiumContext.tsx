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
  const [isPremium, setIsPremium] = useState(true); // Always premium/free
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // No need to initialize RevenueCat - app is completely free
    setIsPremium(true);
  }, []);

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
      // App is free - no purchase needed
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
      // App is free - nothing to restore
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
      // App is free - no subscription to cancel
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