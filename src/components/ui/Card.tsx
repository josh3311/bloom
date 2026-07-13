import React from 'react'
import { View, StyleSheet, ViewStyle } from 'react-native'
import { useTheme } from '@/src/styles/ThemeProvider'

interface CardProps {
  children: React.ReactNode
  style?: ViewStyle
}

export function Card({ children, style }: CardProps) {
  const theme = useTheme()

  return (
    <View style={[styles.base, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border }, style]}>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
  },
})
