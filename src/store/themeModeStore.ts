import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

export type ThemeMode = 'light' | 'dark'

interface ThemeModeState {
  mode: ThemeMode
  toggleMode: () => void
}

export const useThemeMode = create<ThemeModeState>()(
  persist(
    (set) => ({
      mode: 'light',
      toggleMode: () => set((state) => ({ mode: state.mode === 'light' ? 'dark' : 'light' })),
    }),
    {
      name: 'theme-mode-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)
