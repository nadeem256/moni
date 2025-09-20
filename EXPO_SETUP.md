# 🚀 Expo Setup Guide - Run in Expo Go & Publish to Stores

This guide will help you run the Moni app in Expo Go and prepare it for Google Play Store and Apple App Store publication.

## 📱 Quick Start with Expo Go

### 1. Install Expo CLI
```bash
npm install -g @expo/cli
```

### 2. Start the Development Server
```bash
cd your-project-directory
npm install
npx expo start
```

### 3. Run in Expo Go
- **iOS**: Scan the QR code with your iPhone camera
- **Android**: Scan the QR code with the Expo Go app

## 🏗️ Building for Production

### 1. Install EAS CLI
```bash
npm install -g eas-cli
```

### 2. Configure EAS
```bash
eas login
eas build:configure
```

### 3. Build for Android (Google Play)
```bash
# Development build
eas build --platform android --profile development

# Production build (AAB for Google Play)
eas build --platform android --profile production
```

### 4. Build for iOS (App Store)
```bash
# Development build
eas build --platform ios --profile development

# Production build
eas build --platform ios --profile production
```

## 📦 Publishing to Stores

### Google Play Store
```bash
# Submit to Google Play
eas submit --platform android
```

### Apple App Store
```bash
# Submit to App Store
eas submit --platform ios
```

## 🔧 Adding RevenueCat for Real Subscriptions

### 1. Install RevenueCat SDK
```bash
npx expo install react-native-purchases
```

### 2. Update app.json
Add to the plugins array:
```json
{
  "expo": {
    "plugins": [
      "expo-router",
      "expo-font",
      "expo-blur",
      "expo-linear-gradient",
      "react-native-purchases"
    ]
  }
}
```

### 3. Replace Demo Context
Replace the demo `PremiumContext.tsx` with the RevenueCat implementation from `SETUP_GUIDE.md`.

### 4. Configure RevenueCat
- Create account at [RevenueCat Dashboard](https://app.revenuecat.com)
- Add your app and create products
- Replace API key in the context file

## 🎯 Key Features Ready for Production

✅ **Expo Go Compatible** - Runs perfectly in Expo Go  
✅ **EAS Build Ready** - Configured for production builds  
✅ **Store Ready** - Proper bundle IDs and configurations  
✅ **Demo Mode** - Works without RevenueCat for testing  
✅ **TypeScript** - Full type safety  
✅ **Responsive Design** - Works on all screen sizes  

## 📋 Pre-Publication Checklist

- [ ] Test thoroughly in Expo Go
- [ ] Update app name, description, and metadata
- [ ] Add proper app icons and splash screens
- [ ] Configure RevenueCat for real subscriptions
- [ ] Test on physical devices
- [ ] Create store listings (Google Play Console / App Store Connect)
- [ ] Submit for review

## 🆘 Troubleshooting

**Expo Go Issues:**
- Ensure you're on the same network as your development machine
- Try clearing Expo Go cache
- Restart the development server with `--clear` flag

**Build Issues:**
- Check that all dependencies are Expo-compatible
- Verify your EAS configuration
- Review build logs for specific errors

**Store Submission:**
- Ensure proper bundle identifiers
- Add required privacy policies
- Test on multiple devices and OS versions

---

Your app is now ready to run in Expo Go and can be built for production deployment to both Google Play Store and Apple App Store! 🎉