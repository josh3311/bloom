import React from 'react'
import { View, Pressable, Text, StyleSheet } from 'react-native'
import { useTheme } from '@/src/styles/ThemeProvider'

interface CounterProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
}

export function Counter({ value, onChange, min = 0, max = 999 }: CounterProps) {
  const theme = useTheme()
  const atMin = value <= min
  const atMax = value >= max

  return (
    <View style={styles.row}>
      <Pressable
        disabled={atMin}
        onPress={() => onChange(Math.max(min, value - 1))}
        style={({ pressed }) => [
          styles.circle,
          {
            backgroundColor: theme.input,
            borderColor: theme.border,
            opacity: atMin ? 0.4 : pressed ? 0.8 : 1,
          },
        ]}
      >
        <Text style={[styles.symbol, { color: theme.foreground }]}>−</Text>
      </Pressable>

      <Text style={[styles.value, { color: theme.foreground }]}>{value}</Text>

      <Pressable
        disabled={atMax}
        onPress={() => onChange(Math.min(max, value + 1))}
        style={({ pressed }) => [
          styles.circle,
          {
            backgroundColor: theme.primary,
            borderColor: theme.primary,
            opacity: atMax ? 0.4 : pressed ? 0.85 : 1,
          },
        ]}
      >
        <Text style={[styles.symbol, { color: theme.primaryForeground }]}>+</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbol: {
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 16,
  },
  value: {
    fontSize: 14,
    minWidth: 18,
    textAlign: 'center',
  },
})
