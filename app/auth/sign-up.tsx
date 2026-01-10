import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

export default function SignUpScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { signUp } = useAuth();
  const { theme, isDark } = useTheme();

  const handleSignUp = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password, fullName);
      Alert.alert(
        'Success!', 
        'Account created successfully. Please check your email to verify your account.',
        [{ text: 'OK', onPress: () => router.replace('/auth/sign-in') }]
      );
    } catch (error: any) {
      Alert.alert('Sign Up Failed', error.message);
    } finally {
      setLoading(false);
    }
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
      
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Create Account</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Join Moni and take control of your finances
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Full Name Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Full Name</Text>
            <BlurView intensity={60} tint={isDark ? 'dark' : 'light'} style={styles.inputContainer}>
              <LinearGradient
                colors={isDark 
                  ? ['rgba(26, 26, 46, 0.8)', 'rgba(22, 33, 62, 0.6)'] 
                  : ['rgba(255, 255, 255, 0.8)', 'rgba(248, 250, 252, 0.6)']}
                style={styles.inputGradient}
              />
              <View style={styles.inputContent}>
                <User size={20} color={theme.colors.textSecondary} />
                <TextInput
                  style={[styles.textInput, { color: theme.colors.text }]}
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Enter your full name"
                  placeholderTextColor={theme.colors.textSecondary}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              </View>
            </BlurView>
          </View>

          {/* Email Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Email</Text>
            <BlurView intensity={60} tint={isDark ? 'dark' : 'light'} style={styles.inputContainer}>
              <LinearGradient
                colors={isDark 
                  ? ['rgba(26, 26, 46, 0.8)', 'rgba(22, 33, 62, 0.6)'] 
                  : ['rgba(255, 255, 255, 0.8)', 'rgba(248, 250, 252, 0.6)']}
                style={styles.inputGradient}
              />
              <View style={styles.inputContent}>
                <Mail size={20} color={theme.colors.textSecondary} />
                <TextInput
                  style={[styles.textInput, { color: theme.colors.text }]}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  placeholderTextColor={theme.colors.textSecondary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </BlurView>
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Password</Text>
            <BlurView intensity={60} tint={isDark ? 'dark' : 'light'} style={styles.inputContainer}>
              <LinearGradient
                colors={isDark 
                  ? ['rgba(26, 26, 46, 0.8)', 'rgba(22, 33, 62, 0.6)'] 
                  : ['rgba(255, 255, 255, 0.8)', 'rgba(248, 250, 252, 0.6)']}
                style={styles.inputGradient}
              />
              <View style={styles.inputContent}>
                <Lock size={20} color={theme.colors.textSecondary} />
                <TextInput
                  style={[styles.textInput, { color: theme.colors.text }]}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Create a password"
                  placeholderTextColor={theme.colors.textSecondary}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <EyeOff size={20} color={theme.colors.textSecondary} />
                  ) : (
                    <Eye size={20} color={theme.colors.textSecondary} />
                  )}
                </TouchableOpacity>
              </View>
            </BlurView>
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Confirm Password</Text>
            <BlurView intensity={60} tint={isDark ? 'dark' : 'light'} style={styles.inputContainer}>
              <LinearGradient
                colors={isDark 
                  ? ['rgba(26, 26, 46, 0.8)', 'rgba(22, 33, 62, 0.6)'] 
                  : ['rgba(255, 255, 255, 0.8)', 'rgba(248, 250, 252, 0.6)']}
                style={styles.inputGradient}
              />
              <View style={styles.inputContent}>
                <Lock size={20} color={theme.colors.textSecondary} />
                <TextInput
                  style={[styles.textInput, { color: theme.colors.text }]}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm your password"
                  placeholderTextColor={theme.colors.textSecondary}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? (
                    <EyeOff size={20} color={theme.colors.textSecondary} />
                  ) : (
                    <Eye size={20} color={theme.colors.textSecondary} />
                  )}
                </TouchableOpacity>
              </View>
            </BlurView>
          </View>

          {/* Sign Up Button */}
          <BlurView intensity={80} tint={isDark ? 'dark' : 'light'} style={styles.signUpButton}>
            <TouchableOpacity
              style={[styles.signUpButtonContent, loading && styles.buttonDisabled]}
              onPress={handleSignUp}
              disabled={loading}
            >
              <LinearGradient
                colors={loading ? ['#CBD5E1', '#94A3B8'] : ['#3B82F6', '#1D4ED8']}
                style={styles.signUpButtonGradient}
              />
              <View style={styles.signUpButtonInner}>
                <Text style={styles.signUpButtonText}>
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Text>
                {!loading && <ArrowRight size={20} color="#FFFFFF" />}
              </View>
            </TouchableOpacity>
          </BlurView>

          {/* Sign In Link */}
          <View style={styles.signInContainer}>
            <Text style={[styles.signInText, { color: theme.colors.textSecondary }]}>
              Already have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => router.push('/auth/sign-in')}>
              <Text style={[styles.signInLink, { color: theme.colors.primary }]}>
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  form: {
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
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  inputGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  inputContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
  },
  signUpButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 8,
    borderWidth: 0.5,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  signUpButtonContent: {
    padding: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  signUpButtonGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  signUpButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  signUpButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  signInText: {
    fontSize: 16,
  },
  signInLink: {
    fontSize: 16,
    fontWeight: '600',
  },
});