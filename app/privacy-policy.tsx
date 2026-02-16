import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

export default function PrivacyPolicyScreen() {
  const { theme, isDark } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <LinearGradient
        colors={isDark ? ['#0A0B0F', '#12131A', '#0F1014'] : ['#F8FAFC', '#E2E8F0', '#CBD5E1']}
        style={styles.backgroundGradient}
      />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>Privacy Policy</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.lastUpdated}>
          <Text style={[styles.lastUpdatedText, { color: theme.colors.textSecondary }]}>
            Last Updated: January 19, 2026
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Introduction</Text>
          <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
            Welcome to MONi. We are committed to protecting your personal information and your right to privacy.
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Information We Collect</Text>

          <Text style={[styles.subsectionTitle, { color: theme.colors.text }]}>Personal Information</Text>
          <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
            When you create an account, we collect:
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>• Email address</Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>• Full name (optional)</Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>• Profile picture (optional)</Text>

          <Text style={[styles.subsectionTitle, { color: theme.colors.text }]}>Financial Information</Text>
          <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
            We store your financial data including:
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>• Transaction records (income and expenses)</Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>• Subscription information</Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>• Budget and savings goals</Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>• Categories and financial preferences</Text>

          <Text style={[styles.subsectionTitle, { color: theme.colors.text }]}>Usage Information</Text>
          <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
            We automatically collect certain information when you use our app:
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>• Device information</Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>• Log data and analytics</Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>• App usage patterns</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>How We Use Your Information</Text>
          <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
            We use the information we collect to:
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>• Provide and maintain our services</Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>• Process your transactions and manage your account</Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>• Send you notifications about subscriptions and bills</Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>• Improve and optimize our app</Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>• Provide customer support</Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>• Detect and prevent fraud or security issues</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Data Storage and Security</Text>
          <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
            Your data is stored securely using Supabase, a secure and reliable database service. We implement
            industry-standard security measures including:
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>• Encrypted data transmission (SSL/TLS)</Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>• Secure authentication</Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>• Row-level security policies</Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>• Regular security audits</Text>
          <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
            However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Data Sharing and Disclosure</Text>
          <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
            We do not sell your personal information. We may share your information only in the following circumstances:
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>• With your consent</Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>• To comply with legal obligations</Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>• To protect our rights and safety</Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>• With service providers who assist in operating our app</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Your Privacy Rights</Text>
          <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
            You have the right to:
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>• Access your personal data</Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>• Correct inaccurate data</Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>• Request deletion of your data</Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>• Export your data</Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>• Opt-out of certain data collection</Text>
          <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
            To exercise these rights, please contact us at privacy@moni.app
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Children's Privacy</Text>
          <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
            Our service is not intended for users under the age of 13. We do not knowingly collect personal
            information from children under 13. If you are a parent or guardian and believe your child has
            provided us with personal information, please contact us.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Third-Party Services</Text>
          <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
            Our app uses third-party services that may collect information used to identify you:
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>• Supabase (database and authentication)</Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>• Expo (app development framework)</Text>
          <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
            These services have their own privacy policies addressing how they handle your data.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Data Retention</Text>
          <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
            We retain your personal information for as long as your account is active or as needed to provide
            you services. If you wish to delete your account, you can do so from the settings page, and we will
            delete your personal information within 30 days, except where we are required to retain it for legal purposes.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>International Data Transfers</Text>
          <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
            Your information may be transferred to and maintained on computers located outside of your state,
            province, country, or other governmental jurisdiction where data protection laws may differ. We ensure
            appropriate safeguards are in place to protect your information.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Changes to This Privacy Policy</Text>
          <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the
            new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this
            Privacy Policy periodically for any changes.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Contact Us</Text>
          <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
            If you have any questions about this Privacy Policy, please contact us:
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>• Email: privacy@moni.app</Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>• Support: support@moni.app</Text>
        </View>

        <View style={styles.bottomSpacer} />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  lastUpdated: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  lastUpdatedText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 12,
  },
  bulletPoint: {
    fontSize: 15,
    lineHeight: 24,
    marginLeft: 8,
    marginBottom: 8,
  },
  bottomSpacer: {
    height: 60,
  },
});
