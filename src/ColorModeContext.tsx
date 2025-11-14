import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { PaletteMode } from '@mui/material'
import { createAppTheme } from './theme'

type ColorModeValue = PaletteMode | 'system'

interface ColorModeContextProps {
  mode: ColorModeValue
  resolvedMode: PaletteMode
  highContrast: boolean
  toggleHighContrast: () => void
  cycleMode: () => void
  setMode: (m: ColorModeValue) => void
}

export const ColorModeContext = createContext<ColorModeContextProps>({
  mode: 'system',
  resolvedMode: 'light',
  highContrast: false,
  toggleHighContrast: () => undefined,
  cycleMode: () => undefined,
  setMode: () => undefined,
})

const STORAGE_KEY = 'app-color-mode'

export const ColorModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ColorModeValue>('system')
  const [resolvedMode, setResolvedMode] = useState<PaletteMode>('light')
  const [highContrast, setHighContrast] = useState(false)

  // Resolve system if needed
  const computeResolved = useCallback(
    (current: ColorModeValue): PaletteMode => {
      if (current !== 'system') return current
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      return prefersDark ? 'dark' : 'light'
    },
    []
  )

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ColorModeValue | null
    if (stored) setMode(stored)
  }, [])

  useEffect(() => {
    const resolved = computeResolved(mode)
    setResolvedMode(resolved)
  }, [mode, computeResolved])

  useEffect(() => {
    if (mode !== 'system') localStorage.setItem(STORAGE_KEY, mode)
    else localStorage.removeItem(STORAGE_KEY)
  }, [mode])

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const listener = () => {
      if (mode === 'system') setResolvedMode(computeResolved('system'))
    }
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [mode, computeResolved])

  const cycleMode = () => {
    setMode(prev => (prev === 'system' ? 'light' : prev === 'light' ? 'dark' : 'system'))
  }

  const theme = useMemo(() => createAppTheme(resolvedMode, highContrast), [resolvedMode, highContrast])

  return (
    <ColorModeContext.Provider value={{ mode, resolvedMode, highContrast, toggleHighContrast: () => setHighContrast(h => !h), cycleMode, setMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}
