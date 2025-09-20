import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { Eye, Calendar, Heart } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { theme } = useTheme();

  const slides = [
    {
      icon: Eye,
      title: 'See your money clearly',
      description: 'Track your balance and spending with a clean, stress-free interface',
      color: '#3B82F6',
    },
    {
      icon: Calendar,
      title: 'Track subscriptions easily',
      description: 'Never miss a renewal with smart reminders and beautiful organization',
      color: '#10B981',
    },
    {
      icon: Heart,
      title: 'Stay stress-free',
      description: 'Minimalist design focused on what matters most - your financial clarity',
      color: '#F59E0B',
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      router.replace('/(tabs)');
    }
  };

  const handleSkip = () => {
    router.replace('/(tabs)');
  };

  const currentSlideData = slides[currentSlide];
  const IconComponent = currentSlideData.icon;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={[styles.skipText, { color: theme.colors.textSecondary }]}>Skip</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: `${currentSlideData.color}15` }]}>
          <IconComponent size={64} color={currentSlideData.color} />
        </View>

        <Text style={styles.title}>{currentSlideData.title}</Text>
        <Text style={[styles.description, { color: theme.colors.textSecondary }]}>{currentSlideData.description}</Text>
      </View>

      <View style={styles.bottom}>
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                {
                  backgroundColor: index === currentSlide ? currentSlideData.color : '#E2E8F0',
                  width: index === currentSlide ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.nextButton, { backgroundColor: currentSlideData.color }]}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>
            {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 24,
    zIndex: 1,
    padding: 8,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 40,
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 28,
    maxWidth: 300,
  },
  bottom: {
    paddingHorizontal: 32,
    paddingBottom: 60,
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 48,
    gap: 8,
  },
  paginationDot: {
    height: 8,
    borderRadius: 4,
  },
  nextButton: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});