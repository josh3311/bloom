import React, { useState } from 'react'
import { TextInput, StyleSheet, TextInputProps, View } from 'react-native'
import { useTheme } from '@/src/styles/ThemeProvider'

interface InputProps extends TextInputProps {
  error?: string
}

export function Input({ error, style, onFocus, onBlur, ...rest }: InputProps) {
  const theme = useTheme()
  const [focused, setFocused] = useState(false)

  return (
    <View style={styles.wrapper}>
      <TextInput
        style={[
          styles.base,
          {
            backgroundColor: theme.input,
            borderColor: error ? theme.destructive : focused ? theme.ring : theme.border,
            borderWidth: focused ? 2 : 1,
            color: theme.foreground,
          },
          style,
        ]}
        placeholderTextColor={theme.mutedForeground}
        onFocus={(e) => {
          setFocused(true)
          onFocus?.(e)
        }}
        onBlur={(e) => {
          setFocused(false)
          onBlur?.(e)
        }}
        {...rest}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: { width: '100%' },
  base: {
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 12,
    fontSize: 14,
    minHeight: 44,
  },
})
