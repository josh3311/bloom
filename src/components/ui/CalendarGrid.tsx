import React from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useTheme } from '@/src/styles/ThemeProvider'

interface CalendarGridProps {
  year: number
  month: number
  selectedDate: string
  datesWithTasks: Set<string>
  onSelectDate: (date: string) => void
  onPrevMonth: () => void
  onNextMonth: () => void
}

const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function toKey(y: number, m: number, d: number) {
  return `${y}-${pad(m + 1)}-${pad(d)}`
}

function todayKey() {
  const now = new Date()
  return toKey(now.getFullYear(), now.getMonth(), now.getDate())
}

export function CalendarGrid({
  year,
  month,
  selectedDate,
  datesWithTasks,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
}: CalendarGridProps) {
  const theme = useTheme()
  const today = todayKey()

  const monthLabel = new Date(year, month, 1).toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  })

  const firstWeekday = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  const cells: { day: number; inMonth: boolean; key: string }[] = []

  for (let i = firstWeekday - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i
    const m = month === 0 ? 11 : month - 1
    const y = month === 0 ? year - 1 : year
    cells.push({ day, inMonth: false, key: toKey(y, m, day) })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, inMonth: true, key: toKey(year, month, d) })
  }
  const totalCells = Math.ceil((firstWeekday + daysInMonth) / 7) * 7
  const trailingCount = totalCells - cells.length
  const nextM = month === 11 ? 0 : month + 1
  const nextY = month === 11 ? year + 1 : year
  for (let d = 1; d <= trailingCount; d++) {
    cells.push({ day: d, inMonth: false, key: toKey(nextY, nextM, d) })
  }

  return (
    <View>
      <View style={styles.header}>
        <Pressable onPress={onPrevMonth} hitSlop={10} style={styles.navButton}>
          <Text style={{ color: theme.mutedForeground, fontSize: 16 }}>‹</Text>
        </Pressable>
        <Text style={{ color: theme.foreground, fontSize: 14, fontWeight: '500' }}>{monthLabel}</Text>
        <Pressable onPress={onNextMonth} hitSlop={10} style={styles.navButton}>
          <Text style={{ color: theme.mutedForeground, fontSize: 16 }}>›</Text>
        </Pressable>
      </View>

      <View style={styles.weekRow}>
        {WEEKDAY_LABELS.map((w, i) => (
          <Text key={i} style={[styles.weekdayLabel, { color: theme.mutedForeground }]}>
            {w}
          </Text>
        ))}
      </View>

      <View style={styles.grid}>
        {cells.map((cell, idx) => {
          const isSelected = cell.key === selectedDate
          const isToday = cell.key === today
          const hasTasks = datesWithTasks.has(cell.key)

          return (
            <Pressable
              key={idx}
              onPress={() => onSelectDate(cell.key)}
              style={styles.cellWrapper}
            >
              <View
                style={[
                  styles.cell,
                  isSelected && { backgroundColor: theme.primary },
                  !isSelected && isToday && { borderWidth: 1, borderColor: theme.primary },
                ]}
              >
                <Text
                  style={{
                    fontSize: 13,
                    color: isSelected
                      ? theme.primaryForeground
                      : cell.inMonth
                      ? theme.foreground
                      : theme.mutedForeground,
                    opacity: cell.inMonth ? 1 : 0.4,
                  }}
                >
                  {cell.day}
                </Text>
              </View>
              {hasTasks && !isSelected && (
                <View style={[styles.dot, { backgroundColor: theme.chartAccent }]} />
              )}
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  navButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  weekdayLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cellWrapper: {
    width: `${100 / 7}%`,
    alignItems: 'center',
    paddingVertical: 3,
  },
  cell: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 2,
  },
})
