import React from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useTheme } from '@/src/styles/ThemeProvider'
import { Checkbox } from './Checkbox'

interface HistoryItemRowProps {
  name: string
  completed: boolean
  onToggle: () => void
  total?: string
}

export function HistoryItemRow({ name, completed, onToggle, total }: HistoryItemRowProps) {
  const theme = useTheme()

  return (
    <Pressable onPress={onToggle} style={[styles.row, { borderBottomColor: theme.border }]}>
      <Checkbox checked={completed} onChange={onToggle} />
      <Text
        style={[
          styles.name,
          {
            color: completed ? theme.mutedForeground : theme.foreground,
            textDecorationLine: completed ? 'line-through' : 'none',
          },
        ]}
        numberOfLines={1}
      >
        {name}
      </Text>
      {total ? (
        <Text style={{ color: theme.mutedForeground, fontSize: 12 }}>{total}</Text>
      ) : null}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderBottomWidth: 0.5,
  },
  name: {
    flex: 1,
    fontSize: 13,
  },
})
