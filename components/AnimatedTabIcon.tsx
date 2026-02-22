import { useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { LucideIcon } from 'lucide-react-native';

interface AnimatedTabIconProps {
  Icon: LucideIcon;
  size: number;
  color: string;
  focused: boolean;
}

export function AnimatedTabIcon({ Icon, size, color, focused }: AnimatedTabIconProps) {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (focused) {
      scale.value = withSequence(
        withSpring(1.2, { damping: 8, stiffness: 150 }),
        withSpring(1, { damping: 10, stiffness: 100 })
      );
    } else {
      scale.value = withSpring(1, { damping: 10 });
    }
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Icon size={size + 2} color={color} strokeWidth={2.2} />
    </Animated.View>
  );
}
