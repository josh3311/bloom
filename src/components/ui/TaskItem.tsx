import React from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useTheme } from '@/src/styles/ThemeProvider'
import { Checkbox } from './Checkbox'

interface TaskItemProps {
  title: string
  completed: boolean
  onToggle: () => void
  onDelete?: () => void
  subtitle?: string
}

export function TaskItem({ title, completed, onToggle, onDelete, subtitle }: TaskItemProps) {
  const theme = useTheme()

  return (
    <View style={[styles.row, { borderBottomColor: theme.border }]}>
      <Pressable onPress={onToggle} style={styles.pressableRow}>
        <Checkbox checked={completed} onChange={onToggle} />
        <View style={{ flex: 1 }}>
          <Text
            style={[
              styles.title,
              {
                color: completed ? theme.mutedForeground : theme.foreground,
                textDecorationLine: completed ? 'line-through' : 'none',
              },
            ]}
          >
            {title}
          </Text>
          {subtitle ? (
            <Text style={[styles.subtitle, { color: theme.mutedForeground }]}>{subtitle}</Text>
          ) : null}
        </View>
      </Pressable>
      {onDelete && (
        <Pressable onPress={onDelete} hitSlop={8}>
          <Text style={{ color: theme.destructive, fontSize: 13 }}>Delete</Text>
        </Pressable>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderBottomWidth: 0.5,
    minHeight: 44,
  },
  pressableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  title: {
    fontSize: 14,
    flexShrink: 1,
  },
  subtitle: {
    fontSize: 11,
    marginTop: 2,
  },
})
