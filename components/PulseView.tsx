import { ReactNode, useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface PulseViewProps {
  children: ReactNode;
  duration?: number;
  minScale?: number;
  maxScale?: number;
  style?: any;
}

export function PulseView({
  children,
  duration = 2000,
  minScale = 0.98,
  maxScale = 1.02,
  style,
}: PulseViewProps) {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(maxScale, {
          duration: duration / 2,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(minScale, {
          duration: duration / 2,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[style, animatedStyle]}>
      {children}
    </Animated.View>
  );
}
