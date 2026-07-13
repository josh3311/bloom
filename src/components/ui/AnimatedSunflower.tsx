import React, { useEffect } from 'react'
import { Image, ImageSourcePropType } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  withSpring,
  Easing,
} from 'react-native-reanimated'

interface AnimatedSunflowerProps {
  source: ImageSourcePropType
  size?: number
}

export function AnimatedSunflower({ source, size = 64 }: AnimatedSunflowerProps) {
  const scale = useSharedValue(0.5)
  const rotate = useSharedValue(-20)
  const bob = useSharedValue(0)

  useEffect(() => {
    scale.value = withSpring(1, { damping: 6 })
    rotate.value = withSpring(0, { damping: 7 })
    bob.value = withRepeat(
      withSequence(
        withTiming(-4, { duration: 1400, easing: Easing.inOut(Easing.sin) }),
        withTiming(4, { duration: 1400, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    )
  }, [])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
      { translateY: bob.value },
    ],
  }))

  return (
    <Animated.View style={animatedStyle}>
      <Image source={source} style={{ width: size, height: size }} resizeMode="contain" />
    </Animated.View>
  )
}
