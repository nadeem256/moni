# Moni - Financial Tracking App

A beautiful, minimalist financial tracking app built with Expo and React Native.

## 🚀 Quick RevenueCat Setup (5 Minutes)

### Step 1: Export to Local Development
```bash
# Create a new Expo project locally
npx create-expo-app MoniApp --template blank-typescript
cd MoniApp

# Copy all files from this Bolt project to your local project
# (Copy everything except node_modules and .expo folders)
```

### Step 2: Install Dependencies
```bash
# Install all dependencies
npm install

# Install RevenueCat SDK
npm install react-native-purchases

# Install development client for native features
npx expo install expo-dev-client
```

### Step 3: RevenueCat Dashboard Setup
1. Go to [RevenueCat Dashboard](https://app.revenuecat.com)
2. Create account and new project
3. Add your app (iOS/Android)
4. Create a product called "premium_monthly" for $4.99/month
5. Create entitlement called "premium"
6. Copy your **Public API Key**

### Step 4: Update Configuration
Replace `YOUR_REVENUECAT_API_KEY_HERE` in `contexts/PremiumContext.tsx` with your actual API key.

### Step 5: Build and Test
```bash
# Create development build
npx expo run:ios    # for iOS
# or
npx expo run:android # for Android

# Test on real device (required for purchases)
```

## 📱 App Store Setup

### iOS (App Store Connect)
1. Create app in App Store Connect
2. Add In-App Purchase: "premium_monthly" - $4.99/month subscription
3. Submit for review

### Android (Google Play Console)
1. Create app in Google Play Console
2. Add subscription: "premium_monthly" - $4.99/month
3. Publish to internal testing

## ✅ Features

- Beautiful glassmorphism UI
- Transaction tracking (income/expenses)
- Subscription management with renewal reminders
- Financial insights and analytics
- Premium subscription with RevenueCat
- Cross-platform (iOS, Android, Web)

## 🔧 Development

```bash
npm run dev        # Start development server
npm run build:web  # Build for web
```

## 📋 Premium Features

**Free Plan:**
- Track up to 3 subscriptions
- Basic transaction tracking
- Simple analytics

**Premium Plan ($4.99/month):**
- ✅ Unlimited subscriptions
- ✅ Advanced analytics & insights
- ✅ AI-powered financial predictions
- ✅ Data export to CSV
- ✅ Smart notifications & alerts
- ✅ Investment tracking
- ✅ Bank-level security
- ✅ Priority support

## 🛠 Tech Stack

- **Framework**: Expo with React Native
- **Navigation**: Expo Router
- **Subscriptions**: RevenueCat
- **Storage**: AsyncStorage
- **Icons**: Lucide React Native
- **Styling**: Native StyleSheet with glassmorphism

## 📞 Support

For support, contact: support@moni.app

---

**Ready to launch!** 🚀 Just follow the 5 steps above and you'll have a production-ready subscription app.