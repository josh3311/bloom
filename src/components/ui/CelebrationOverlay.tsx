import React, { useEffect, useMemo } from 'react'
import { StyleSheet, Image, Dimensions } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withSpring,
  withDelay,
} from 'react-native-reanimated'
import { useTheme } from '@/src/styles/ThemeProvider'

const FLOWER_COUNT = 36
const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window')

interface FlowerSpec {
  top: number
  left: number
  size: number
  rotate: number
  delay: number
}

function FloatingFlower({ spec }: { spec: FlowerSpec }) {
  const scale = useSharedValue(0)
  const opacity = useSharedValue(0)

  useEffect(() => {
    scale.value = withDelay(spec.delay, withSpring(1, { damping: 7 }))
    opacity.value = withDelay(spec.delay, withTiming(1, { duration: 250 }))
  }, [])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }, { rotate: `${spec.rotate}deg` }],
  }))

  return (
    <Animated.View
      style={[{ position: 'absolute', top: spec.top, left: spec.left }, animatedStyle]}
    >
      <Image
        source={require('@/assets/images/sunflowers/sunflower-3d1.webp')}
        style={{ width: spec.size, height: spec.size }}
        resizeMode="contain"
      />
    </Animated.View>
  )
}

export function CelebrationOverlay() {
  const theme = useTheme()
  const containerOpacity = useSharedValue(0)

  const flowers = useMemo<FlowerSpec[]>(() => {
    return Array.from({ length: FLOWER_COUNT }, () => ({
      top: Math.random() * (SCREEN_H - 60),
      left: Math.random() * (SCREEN_W - 60),
      size: 28 + Math.random() * 34,
      rotate: Math.random() * 360,
      delay: Math.random() * 900,
    }))
  }, [])

  useEffect(() => {
    containerOpacity.value = withSequence(
      withTiming(1, { duration: 200 }),
      withTiming(1, { duration: 4800 }),
      withTiming(0, { duration: 600 })
    )
  }, [])

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }))

  return (
    <Animated.View
      style={[styles.overlay, { backgroundColor: theme.background }, containerStyle]}
      pointerEvents="none"
    >
      {flowers.map((spec, i) => (
        <FloatingFlower key={i} spec={spec} />
      ))}
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
  },
})
