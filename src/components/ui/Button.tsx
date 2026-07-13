import React from 'react'
import { Pressable, Text, StyleSheet, PressableProps, ViewStyle } from 'react-native'
import { useTheme } from '@/src/styles/ThemeProvider'

export type ButtonVariant = 'primary' | 'secondary' | 'outline'

interface ButtonProps extends Omit<PressableProps, 'style'> {
  children: string
  variant?: ButtonVariant
  disabled?: boolean
  style?: ViewStyle
}

export function Button({ children, variant = 'primary', disabled, style, ...rest }: ButtonProps) {
  const theme = useTheme()

  const backgroundColor =
    variant === 'primary' ? theme.primary : variant === 'secondary' ? theme.secondary : 'transparent'

  const textColor =
    variant === 'primary' ? theme.primaryForeground : variant === 'secondary' ? theme.secondaryForeground : theme.primary

  const borderColor = variant === 'outline' ? theme.primary : 'transparent'

  return (
    <Pressable
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor,
          borderColor,
          borderWidth: variant === 'outline' ? 1 : 0,
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
          transform: [{ scale: pressed ? 0.97 : 1 }],
        },
        style,
      ]}
      {...rest}
    >
      <Text style={[styles.text, { color: textColor }]}>{children}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
  },
})
