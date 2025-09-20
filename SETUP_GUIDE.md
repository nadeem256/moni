# 🚀 RevenueCat Setup Guide - 5 Minutes to Launch!

## Prerequisites
- RevenueCat account (free at [app.revenuecat.com](https://app.revenuecat.com))
- Apple Developer account (for iOS) or Google Play Console (for Android)

## Step 1: RevenueCat Dashboard Setup (2 minutes)

### Create Project
1. Go to [RevenueCat Dashboard](https://app.revenuecat.com)
2. Click "Create New Project"
3. Name it "Moni" or your preferred name

### Add Your App
1. Click "Add App"
2. Choose platform (iOS/Android)
3. Enter bundle ID (e.g., `com.yourname.moni`)

### Create Products
1. Go to "Products" tab
2. Click "Add Product"
3. Product ID: `premium_monthly`
4. Type: Subscription
5. Price: $4.99/month

### Create Entitlement
1. Go to "Entitlements" tab
2. Click "Add Entitlement"
3. Name: `premium`
4. Attach the `premium_monthly` product

### Get API Key
1. Go to "API Keys" tab
2. Copy your **Public API Key**

## Step 2: App Store Setup (iOS)

### App Store Connect
1. Create new app in [App Store Connect](https://appstoreconnect.apple.com)
2. Go to "Features" > "In-App Purchases"
3. Click "+" to add subscription
4. Reference Name: "Premium Monthly"
5. Product ID: `premium_monthly` (must match RevenueCat)
6. Subscription Group: Create new group
7. Price: $4.99/month
8. Submit for review

## Step 3: Google Play Setup (Android)

### Google Play Console
1. Create app in [Google Play Console](https://play.google.com/console)
2. Go to "Monetization" > "Subscriptions"
3. Click "Create subscription"
4. Product ID: `premium_monthly` (must match RevenueCat)
5. Name: "Premium Monthly"
6. Price: $4.99/month
7. Save and activate

## Step 4: Update Your Code (30 seconds)

Open `contexts/PremiumContext.tsx` and replace:
```typescript
const API_KEY = "YOUR_REVENUECAT_API_KEY_HERE";
```

With your actual API key:
```typescript
const API_KEY = "pk_1234567890abcdef"; // Your actual key
```

## Step 5: Build and Test (2 minutes)

```bash
# Install dependencies
npm install
npm install react-native-purchases
npx expo install expo-dev-client

# Build for device (required for purchases)
npx expo run:ios     # for iOS
npx expo run:android # for Android
```

## 🧪 Testing Purchases

### iOS Testing
1. Use sandbox Apple ID in Settings > App Store > Sandbox Account
2. Test purchase flow in your app
3. Verify subscription appears in Settings > Apple ID > Subscriptions

### Android Testing
1. Add test account in Google Play Console
2. Use internal testing track
3. Test purchase with test account

## 🎯 Production Checklist

- [ ] RevenueCat project created
- [ ] Products configured in RevenueCat
- [ ] Entitlements set up
- [ ] API key added to code
- [ ] App Store/Google Play products created
- [ ] Subscription tested on device
- [ ] App submitted for review

## 🆘 Troubleshooting

**"No products found"**
- Ensure product IDs match exactly between RevenueCat and stores
- Wait 2-4 hours after creating products in App Store Connect

**"Purchase failed"**
- Test on real device (not simulator)
- Use sandbox/test accounts
- Check RevenueCat logs in dashboard

**"Entitlement not active"**
- Verify entitlement name is exactly "premium"
- Check product is attached to entitlement in RevenueCat

## 📞 Support

- RevenueCat Docs: [docs.revenuecat.com](https://docs.revenuecat.com)
- Community: [community.revenuecat.com](https://community.revenuecat.com)

---

**You're ready to launch!** 🎉 Your subscription app is now configured and ready for the App Store/Google Play.