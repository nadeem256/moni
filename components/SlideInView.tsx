import { ReactNode, useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
  withSpring,
  Easing,
} from 'react-native-reanimated';

interface SlideInViewProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  from?: 'left' | 'right' | 'top' | 'bottom';
  distance?: number;
  style?: any;
  useSpring?: boolean;
}

export function SlideInView({
  children,
  delay = 0,
  duration = 500,
  from = 'bottom',
  distance = 30,
  style,
  useSpring: shouldUseSpring = false,
}: SlideInViewProps) {
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(from === 'left' ? -distance : from === 'right' ? distance : 0);
  const translateY = useSharedValue(from === 'top' ? -distance : from === 'bottom' ? distance : 0);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withTiming(1, {
        duration,
        easing: Easing.out(Easing.cubic),
      })
    );

    if (shouldUseSpring) {
      translateX.value = withDelay(
        delay,
        withSpring(0, {
          damping: 20,
          stiffness: 90,
        })
      );
      translateY.value = withDelay(
        delay,
        withSpring(0, {
          damping: 20,
          stiffness: 90,
        })
      );
    } else {
      translateX.value = withDelay(
        delay,
        withTiming(0, {
          duration,
          easing: Easing.out(Easing.cubic),
        })
      );
      translateY.value = withDelay(
        delay,
        withTiming(0, {
          duration,
          easing: Easing.out(Easing.cubic),
        })
      );
    }
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <Animated.View style={[style, animatedStyle]}>
      {children}
    </Animated.View>
  );
}
