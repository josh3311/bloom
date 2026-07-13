import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

function todayKey() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
    now.getDate()
  ).padStart(2, '0')}`
}

interface CalendarNavState {
  selectedDate: string
  viewYear: number
  viewMonth: number
  setSelectedDate: (date: string) => void
  goToPrevMonth: () => void
  goToNextMonth: () => void
}

const now = new Date()

export const useCalendarStore = create<CalendarNavState>()(
  persist(
    (set) => ({
      selectedDate: todayKey(),
      viewYear: now.getFullYear(),
      viewMonth: now.getMonth(),

      setSelectedDate: (date) => set({ selectedDate: date }),

      goToPrevMonth: () =>
        set((state) => {
          const m = state.viewMonth - 1
          return m < 0 ? { viewMonth: 11, viewYear: state.viewYear - 1 } : { viewMonth: m }
        }),

      goToNextMonth: () =>
        set((state) => {
          const m = state.viewMonth + 1
          return m > 11 ? { viewMonth: 0, viewYear: state.viewYear + 1 } : { viewMonth: m }
        }),
    }),
    {
      name: 'calendar-nav-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)
