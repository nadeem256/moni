# 🚀 Google Play Store Submission Guide

## Prerequisites
- Google Play Console Developer Account ($25 one-time fee)
- EAS CLI installed globally
- Expo account

## Step 1: Install EAS CLI
```bash
npm install -g eas-cli
```

## Step 2: Login to Expo
```bash
eas login
```

## Step 3: Configure EAS Build
```bash
eas build:configure
```

## Step 4: Build Production APK/AAB
```bash
# Build AAB for Google Play Store (recommended)
eas build --platform android --profile production

# Or build APK for testing
eas build --platform android --profile preview
```

## Step 5: Google Play Console Setup

### 1. Create Google Play Console Account
- Go to [Google Play Console](https://play.google.com/console)
- Pay $25 one-time registration fee
- Complete developer profile

### 2. Create New App
- Click "Create app"
- App name: "Moni - Financial Tracker"
- Default language: English (United States)
- App or game: App
- Free or paid: Free
- Declarations: Complete all required declarations

### 3. App Content & Policies
Complete these required sections:
- **Privacy Policy**: Create and host a privacy policy
- **App Access**: Describe how users access your app
- **Ads**: Declare if your app contains ads (No for this app)
- **Content Rating**: Complete questionnaire (likely PEGI 3/Everyone)
- **Target Audience**: Select appropriate age groups
- **Data Safety**: Declare what data you collect

### 4. Store Listing
- **App Name**: Moni - Financial Tracker
- **Short Description**: Track subscriptions and expenses with beautiful, minimalist design
- **Full Description**: 
```
Take control of your finances with Moni, the beautiful and minimalist financial tracking app.

✨ KEY FEATURES:
• Track income and expenses with ease
• Monitor subscription renewals
• Beautiful glassmorphism design
• Secure local data storage
• Subscription management
• Financial insights and analytics

💎 PREMIUM FEATURES:
• Unlimited subscriptions tracking
• AI-powered financial insights
• Advanced analytics and forecasting
• Smart notifications and alerts
• Investment tracking
• Data export capabilities

🔒 PRIVACY FOCUSED:
Your financial data stays on your device. We prioritize your privacy and security.

Perfect for anyone who wants to stay on top of their finances with a clean, stress-free interface.
```

- **App Icon**: Upload 512x512 PNG icon
- **Feature Graphic**: Create 1024x500 promotional image
- **Screenshots**: Take 2-8 screenshots from different app screens
- **App Category**: Finance
- **Tags**: finance, budget, money, subscriptions, expenses

### 5. Upload Your App
- Go to "Production" → "Create new release"
- Upload the AAB file from EAS build
- Add release notes
- Review and rollout

## Step 6: App Store Assets Needed

### Required Images:
1. **App Icon**: 512x512 PNG (high-res version of your app icon)
2. **Feature Graphic**: 1024x500 PNG (promotional banner)
3. **Screenshots**: 
   - Phone: 16:9 or 9:16 aspect ratio
   - Tablet: 16:10 or 10:16 aspect ratio
   - Take screenshots of: Home screen, Subscriptions, Add transaction, Insights, Profile

### Privacy Policy Template:
```
Privacy Policy for Moni - Financial Tracker

Last updated: [DATE]

This Privacy Policy describes how Moni ("we", "our", or "us") handles your information when you use our mobile application.

Information We Collect:
- We do not collect any personal information
- All financial data is stored locally on your device
- No data is transmitted to our servers

Data Storage:
- All your financial data (transactions, subscriptions, balances) is stored locally on your device
- We do not have access to your financial information
- Data is not shared with third parties

Security:
- Your data remains on your device at all times
- We implement security measures to protect your local data

Contact Us:
If you have questions about this Privacy Policy, contact us at: [YOUR_EMAIL]
```

## Step 7: Testing Before Submission

### Internal Testing:
```bash
# Create internal testing build
eas build --platform android --profile preview
```

- Upload to Google Play Console
- Add internal testers (your email)
- Test thoroughly on real devices

### Pre-Launch Checklist:
- [ ] App builds successfully
- [ ] All features work on real Android devices
- [ ] No crashes or major bugs
- [ ] Privacy policy is live and accessible
- [ ] Store listing is complete
- [ ] Screenshots are high quality
- [ ] App follows Google Play policies

## Step 8: Submit for Review
- Complete all required sections in Google Play Console
- Submit for review
- Review typically takes 1-3 days
- Address any feedback from Google

## Step 9: Post-Launch
- Monitor app performance and reviews
- Respond to user feedback
- Plan updates and new features
- Consider implementing real RevenueCat subscriptions

## Troubleshooting

**Build Fails:**
- Check eas.json configuration
- Ensure all dependencies are compatible
- Review build logs for specific errors

**Review Rejection:**
- Common issues: Missing privacy policy, inappropriate content rating, policy violations
- Address feedback and resubmit

**App Not Installing:**
- Ensure target SDK version is appropriate
- Check device compatibility settings
- Test on multiple Android versions

## Cost Breakdown:
- Google Play Console: $25 (one-time)
- EAS Build: Free tier available, paid plans for more builds
- Total to get started: $25

Your app is now ready for Google Play Store! 🎉