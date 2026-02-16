import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

export default function TermsOfServiceScreen() {
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
        <Text style={[styles.title, { color: theme.colors.text }]}>Terms of Service</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.lastUpdated}>
          <Text style={[styles.lastUpdatedText, { color: theme.colors.textSecondary }]}>
            Last Updated: January 19, 2026
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Agreement to Terms</Text>
          <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
            By accessing or using MONi, you agree to be bound by these Terms of Service and all applicable laws
            and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing
            this application.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Description of Service</Text>
          <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
            MONi is a personal finance management application that helps you track your income, expenses, subscriptions,
            and financial goals. The service is provided to you free of charge, and we reserve the right to modify,
            suspend, or discontinue any part of the service at any time.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>User Account</Text>

          <Text style={[styles.subsectionTitle, { color: theme.colors.text }]}>Account Creation</Text>
          <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
            To use MONi, you must create an account. You agree to:
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>• Provide accurate and complete information</Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>• Maintain the security of your account credentials</Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>• Be responsible for all activities under your account</Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>• Notify us immediately of any unauthorized access</Text>

          <Text style={[styles.subsectionTitle, { color: theme.colors.text }]}>Account Termination</Text>
          <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
            You may delete your account at any time through the app settings. We reserve the right to suspend or
            terminate your account if you violate these Terms of Service or engage in fraudulent, abusive, or
            illegal activities.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>User Responsibilities</Text>
          <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
            As a user of MONi, you agree to:
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>• Use the app only for lawful purposes</Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>• Not attempt to gain unauthorized access to our systems</Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>• Not use the app to transmit malicious code or viruses</Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>• Not interfere with other users' access to the service</Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>• Not reverse engineer, decompile, or disassemble the app</Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>• Not use automated systems to access the app without permission</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Your Data and Privacy</Text>
          <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
            You retain all rights to your financial data. By using MONi, you grant us permission to store and process
            your data as described in our Privacy Policy. You are responsible for:
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>• Maintaining backups of your important data</Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>• The accuracy of data you input into the app</Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>• Reviewing and verifying your financial information</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Intellectual Property</Text>
          <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
            The MONi app, including its design, features, code, and content, is owned by us and protected by
            copyright, trademark, and other intellectual property laws. You may not:
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>• Copy, modify, or distribute the app</Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>• Use our trademarks or branding without permission</Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>• Create derivative works based on our app</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Financial Disclaimer</Text>
          <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
            MONi is a personal finance tracking tool only. We do not provide:
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>• Financial, investment, or tax advice</Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>• Guarantees about financial outcomes</Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>• Professional financial planning services</Text>
          <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
            Always consult with qualified financial professionals for specific financial advice. Any decisions you
            make based on information in the app are your sole responsibility.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Limitation of Liability</Text>
          <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
            To the maximum extent permitted by law, MONi and its creators shall not be liable for:
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>• Any indirect, incidental, or consequential damages</Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>• Loss of profits, data, or business opportunities</Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>• Financial decisions made based on app data</Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>• Service interruptions or data loss</Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>• Errors or inaccuracies in the app</Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>• Unauthorized access to your data despite security measures</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Disclaimer of Warranties</Text>
          <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
            MONi is provided "as is" without warranties of any kind, either express or implied, including but not
            limited to warranties of merchantability, fitness for a particular purpose, or non-infringement. We do
            not warrant that:
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>• The app will be uninterrupted or error-free</Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>• Defects will be corrected immediately</Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>• The app is free of viruses or harmful components</Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>• Results obtained from the app will be accurate or reliable</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Indemnification</Text>
          <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
            You agree to indemnify, defend, and hold harmless MONi and its affiliates from any claims, damages,
            losses, liabilities, and expenses arising from:
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>• Your use of the app</Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>• Your violation of these Terms</Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>• Your violation of any third-party rights</Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>• Any content you submit through the app</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Third-Party Services</Text>
          <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
            MONi may contain links to or integrate with third-party services. We are not responsible for:
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>• The content or practices of third-party services</Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>• Any damages resulting from third-party services</Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>• Changes or discontinuation of third-party services</Text>
          <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
            Your use of third-party services is subject to their own terms and conditions.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Updates and Modifications</Text>
          <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
            We reserve the right to:
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>• Modify or discontinue any feature of the app</Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>• Update these Terms of Service at any time</Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>• Change pricing or features (with notice)</Text>
          <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
            Continued use of the app after changes constitutes acceptance of the new terms. Material changes will
            be communicated through the app or via email.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Dispute Resolution</Text>
          <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
            Any disputes arising from these Terms or your use of MONi shall be resolved through:
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>• Good faith negotiations</Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>• Binding arbitration if negotiations fail</Text>
          <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
            You agree to waive any right to a jury trial or to participate in a class action lawsuit.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Governing Law</Text>
          <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
            These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which
            we operate, without regard to its conflict of law provisions.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Severability</Text>
          <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
            If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited
            or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force
            and effect.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Entire Agreement</Text>
          <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
            These Terms of Service, together with our Privacy Policy, constitute the entire agreement between you
            and MONi regarding the use of our app, superseding any prior agreements.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Contact Information</Text>
          <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
            If you have any questions about these Terms of Service, please contact us:
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>• Email: legal@moni.app</Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>• Support: support@moni.app</Text>
        </View>

        <View style={styles.acknowledgment}>
          <Text style={[styles.acknowledgmentText, { color: theme.colors.textSecondary }]}>
            By using MONi, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
          </Text>
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
  acknowledgment: {
    marginTop: 16,
    padding: 20,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  acknowledgmentText: {
    fontSize: 15,
    lineHeight: 24,
    fontWeight: '500',
    textAlign: 'center',
  },
  bottomSpacer: {
    height: 60,
  },
});
