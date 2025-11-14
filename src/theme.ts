import { createTheme } from '@mui/material/styles'
import { PaletteMode } from '@mui/material'

// Custom spacing scale (index based). Falls back to factor*6 if outside preset.
const spacingValues = [0, 4, 8, 12, 16, 20, 24, 32, 40, 48]

// Design tokens with light/dark + high-contrast variants
const getDesignTokens = (mode: PaletteMode, highContrast: boolean) => {
  const primaryMain = mode === 'light' ? '#3f51b5' : '#8ea4ff'
  const primaryHC = mode === 'light' ? '#002dff' : '#b0c4ff'
  const secondaryMain = mode === 'light' ? '#ff9800' : '#ffb547'
  const secondaryHC = mode === 'light' ? '#ff6a00' : '#ffcb6a'
  return {
    palette: {
      mode,
      primary: { main: highContrast ? primaryHC : primaryMain },
      secondary: { main: highContrast ? secondaryHC : secondaryMain },
      background: {
        default: mode === 'light'
          ? (highContrast ? 'linear-gradient(135deg,#f4f6ff 0%,#e1e7f5 100%)' : 'linear-gradient(135deg,#f7f9fc 0%,#eef2f7 100%)')
          : (highContrast ? 'linear-gradient(135deg,#10141b 0%,#232a33 100%)' : 'linear-gradient(135deg,#121212 0%,#1d1f24 100%)'),
        paper: mode === 'light' ? (highContrast ? '#ffffff' : '#ffffff') : (highContrast ? '#20242b' : '#1e2127'),
      },
      divider: mode === 'light' ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.12)',
      contrastThreshold: highContrast ? 2.8 : 3,
    },
    spacing: (factor: number) => spacingValues[factor] ?? factor * 6,
    shape: { borderRadius: highContrast ? 10 : 12 },
    typography: {
      fontFamily: 'system-ui, "Segoe UI", Roboto, Arial',
      h6: { fontWeight: 600 },
      button: { textTransform: 'none' as const, fontWeight: 600, letterSpacing: highContrast ? 0.6 : 0.4 },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            transition: 'background-color .25s, transform .15s',
            '&:hover': { transform: 'translateY(-2px)' },
            '&:active': { transform: 'translateY(0)' },
            ...(highContrast && { borderWidth: 2, borderStyle: 'solid', borderColor: 'currentColor' }),
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            transition: 'box-shadow .25s, transform .25s',
            '&:hover': {
              boxShadow: mode === 'light' ? '0 8px 24px rgba(0,0,0,0.08)' : '0 8px 24px rgba(0,0,0,0.5)',
            },
            ...(highContrast && { outline: '1px solid rgba(127,127,127,0.35)' }),
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            transition: 'background-color .2s, padding-left .2s',
            '&.Mui-selected': {
              backgroundColor: mode === 'light' ? 'rgba(63,81,181,0.12)' : 'rgba(142,164,255,0.18)',
            },
            '&:hover': { paddingLeft: 20 },
          },
        },
      },
      MuiTooltip: {
        defaultProps: { enterDelay: 400 },
      },
      MuiContainer: {
        styleOverrides: {
          root: {
            paddingTop: spacingValues[4],
            paddingBottom: spacingValues[5],
          },
        },
      },
    },
  }
}

export const createAppTheme = (mode: PaletteMode, highContrast: boolean) => createTheme(getDesignTokens(mode, highContrast))

