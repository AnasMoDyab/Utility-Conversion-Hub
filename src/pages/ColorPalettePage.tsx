import React, { useState } from 'react'
import {
  Paper,
  Typography,
  TextField,
  Box,
  ToggleButtonGroup,
  ToggleButton,
  FormControlLabel,
  Switch,
} from '@mui/material'

function clamp(v: number, min = 0, max = 255) {
  return Math.min(max, Math.max(min, v))
}
function hexToRgb(hex: string) {
  const h = hex.replace('#', '')
  if (h.length === 3) {
    const r = h[0] + h[0]
    const g = h[1] + h[1]
    const b = h[2] + h[2]
    return { r: parseInt(r, 16), g: parseInt(g, 16), b: parseInt(b, 16) }
  }
  if (h.length === 6) {
    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16),
    }
  }
  return { r: 0, g: 0, b: 0 }
}
function rgbToHex({ r, g, b }: { r: number; g: number; b: number }) {
  return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')
}
function luminance({ r, g, b }: { r: number; g: number; b: number }) {
  const a = [r, g, b].map((v) => {
    v /= 255
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2]
}
function contrast(
  c1: { r: number; g: number; b: number },
  c2: { r: number; g: number; b: number }
) {
  const L1 = luminance(c1) + 0.05
  const L2 = luminance(c2) + 0.05
  return L1 > L2 ? L1 / L2 : L2 / L1
}

function generatePalette(base: string, mode: string): string[] {
  const rgb = hexToRgb(base)
  const out: string[] = []
  if (mode === 'mono') {
    for (let i = 0; i < 6; i++) {
      const f = 0.15 * i
      out.push(
        rgbToHex({
          r: clamp(rgb.r * (1 - f)),
          g: clamp(rgb.g * (1 - f)),
          b: clamp(rgb.b * (1 - f)),
        })
      )
    }
  } else if (mode === 'analogous') {
    for (let i = -2; i <= 3; i++) {
      const hsl = rgbToHsl(rgb)
      hsl.h = (hsl.h + i * 20 + 360) % 360
      out.push(rgbToHex(hslToRgb(hsl)))
    }
  } else if (mode === 'triadic') {
    const hsl = rgbToHsl(rgb)
    ;[0, 120, 240].forEach((delta) => {
      const h = { ...hsl, h: (hsl.h + delta) % 360 }
      out.push(rgbToHex(hslToRgb(h)))
    })
  }
  return out
}
// Helpers for HSL conversions
function rgbToHsl({ r, g, b }: { r: number; g: number; b: number }) {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b)
  let h = 0,
    s = 0,
    l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }
  return { h: h * 360, s, l }
}
function hslToRgb({ h, s, l }: { h: number; s: number; l: number }) {
  h /= 360
  let r: number, g: number, b: number
  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  }
}

const ColorPalettePage: React.FC = () => {
  const [base, setBase] = useState('#336699')
  const [mode, setMode] = useState('analogous')
  const [textColor, setTextColor] = useState('#ffffff')
  const [showContrast, setShowContrast] = useState(true)
  const palette = generatePalette(base, mode)
  const rgbText = hexToRgb(textColor)
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Color Palette & Contrast Checker
      </Typography>
      <Typography variant="body2" gutterBottom>
        Generate simple palettes and test WCAG contrast ratio against a chosen
        text color.
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
        <TextField
          label="Base Color"
          value={base}
          onChange={(e) => setBase(e.target.value)}
          sx={{ minWidth: 140 }}
        />
        <TextField
          label="Text Color"
          value={textColor}
          onChange={(e) => setTextColor(e.target.value)}
          sx={{ minWidth: 140 }}
        />
        <ToggleButtonGroup
          exclusive
          value={mode}
          onChange={(_, v) => v && setMode(v)}
        >
          <ToggleButton value="analogous">Analogous</ToggleButton>
          <ToggleButton value="triadic">Triadic</ToggleButton>
          <ToggleButton value="mono">Monochrome</ToggleButton>
        </ToggleButtonGroup>
        <FormControlLabel
          control={
            <Switch
              checked={showContrast}
              onChange={(e) => setShowContrast(e.target.checked)}
            />
          }
          label="Show Contrast"
        />
      </Box>
      <Box
        sx={{
          mt: 3,
          display: 'grid',
          gap: 2,
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(auto-fill, minmax(160px,1fr))',
          },
        }}
      >
        {palette.map((c) => {
          const rgbBg = hexToRgb(c)
          const ratio = contrast(rgbBg, rgbText)
          const passAA = ratio >= 4.5
          return (
            <Paper
              key={c}
              sx={{ p: 1, textAlign: 'center', bgcolor: c, color: textColor }}
              elevation={3}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {c}
              </Typography>
              {showContrast && (
                <Typography variant="caption" sx={{ display: 'block' }}>
                  Contrast: {ratio.toFixed(2)} {passAA ? 'AA ✔' : 'AA ✖'}
                </Typography>
              )}
            </Paper>
          )
        })}
      </Box>
    </Paper>
  )
}

export default ColorPalettePage
