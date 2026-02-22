import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { ReactNode } from 'react';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface AnimatedPressableProps extends TouchableOpacityProps {
  children: ReactNode;
  scaleOnPress?: boolean;
  scale?: number;
}

export function AnimatedPressable({
  children,
  scaleOnPress = true,
  scale = 0.96,
  onPressIn,
  onPressOut,
  ...props
}: AnimatedPressableProps) {
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    if (!scaleOnPress) return {};

    return {
      transform: [
        {
          scale: withSpring(pressed.value ? scale : 1, {
            damping: 15,
            stiffness: 150,
          }),
        },
      ],
    };
  });

  const handlePressIn = (e: any) => {
    pressed.value = 1;
    onPressIn?.(e);
  };

  const handlePressOut = (e: any) => {
    pressed.value = 0;
    onPressOut?.(e);
  };

  return (
    <AnimatedTouchable
      {...props}
      style={[props.style, animatedStyle]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.9}
    >
      {children}
    </AnimatedTouchable>
  );
}
