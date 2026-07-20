import React, { useState } from 'react'
import { Modal, View, Text } from 'react-native'
import { CalendarGrid } from './CalendarGrid'
import { Button } from './Button'
import { useTheme } from '@/src/styles/ThemeProvider'

interface DatePickerModalProps {
  visible: boolean
  value: string // YYYY-MM-DD
  onChange: (date: string) => void
  onClose: () => void
}

export function DatePickerModal({ visible, value, onChange, onClose }: DatePickerModalProps) {
  const theme = useTheme()
  const [y, m] = value.split('-').map(Number)
  const [viewYear, setViewYear] = useState(y)
  const [viewMonth, setViewMonth] = useState(m - 1)

  const goPrev = () => {
    if (viewMonth === 0) {
      setViewYear((yr) => yr - 1)
      setViewMonth(11)
    } else {
      setViewMonth((mo) => mo - 1)
    }
  }

  const goNext = () => {
    if (viewMonth === 11) {
      setViewYear((yr) => yr + 1)
      setViewMonth(0)
    } else {
      setViewMonth((mo) => mo + 1)
    }
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 24 }}>
        <View
          style={{
            backgroundColor: theme.backgroundSecondary,
            borderRadius: 14,
            padding: 16,
            borderWidth: 1,
            borderColor: theme.border,
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: '500', color: theme.foreground, marginBottom: 10 }}>
            Choose a date
          </Text>
          <CalendarGrid
            year={viewYear}
            month={viewMonth}
            selectedDate={value}
            datesWithTasks={new Set()}
            onSelectDate={onChange}
            onPrevMonth={goPrev}
            onNextMonth={goNext}
          />
          <View style={{ marginTop: 12 }}>
            <Button onPress={onClose}>Done</Button>
          </View>
        </View>
      </View>
    </Modal>
  )
}
