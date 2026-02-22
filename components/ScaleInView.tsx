import { ReactNode, useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withDelay,
} from 'react-native-reanimated';

interface ScaleInViewProps {
  children: ReactNode;
  delay?: number;
  initialScale?: number;
  style?: any;
}

export function ScaleInView({
  children,
  delay = 0,
  initialScale = 0.8,
  style,
}: ScaleInViewProps) {
  const scale = useSharedValue(initialScale);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(
      delay,
      withSpring(1, {
        damping: 12,
        stiffness: 100,
      })
    );
    opacity.value = withDelay(
      delay,
      withSpring(1, {
        damping: 15,
        stiffness: 150,
      })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[style, animatedStyle]}>
      {children}
    </Animated.View>
  );
}
