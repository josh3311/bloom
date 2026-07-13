import React, { useEffect, useRef } from 'react'
import { Pressable, StyleSheet } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withSpring,
} from 'react-native-reanimated'
import { useTheme } from '@/src/styles/ThemeProvider'

interface CheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
}

export function Checkbox({ checked, onChange, disabled }: CheckboxProps) {
  const theme = useTheme()
  const scale = useSharedValue(1)
  const isFirst = useRef(true)

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false
      return
    }
    scale.value = withSequence(withTiming(1.3, { duration: 100 }), withSpring(1, { damping: 5 }))
  }, [checked])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      disabled={disabled}
      onPress={() => onChange(!checked)}
      hitSlop={4}
    >
      <Animated.View
        style={[
          styles.box,
          animatedStyle,
          {
            borderColor: checked ? theme.chartAccent : theme.mutedForeground,
            backgroundColor: checked ? theme.chartAccent : 'transparent',
            opacity: disabled ? 0.5 : 1,
          },
        ]}
      />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  box: {
    width: 22,
    height: 22,
    borderRadius: 5,
    borderWidth: 2,
  },
})
