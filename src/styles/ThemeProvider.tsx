import React, { createContext, useContext } from 'react'
import { lightTheme, darkTheme, Theme } from './theme'
import { useThemeMode } from '@/src/store/themeModeStore'

const ThemeContext = createContext<Theme>(lightTheme)

interface ThemeProviderProps {
  children: React.ReactNode
  forceMode?: 'light' | 'dark'
}

export function ThemeProvider({ children, forceMode }: ThemeProviderProps) {
  const storedMode = useThemeMode((state) => state.mode)
  const mode = forceMode ?? storedMode
  const theme = mode === 'dark' ? darkTheme : lightTheme

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
}

export function useTheme(): Theme {
  return useContext(ThemeContext)
}
