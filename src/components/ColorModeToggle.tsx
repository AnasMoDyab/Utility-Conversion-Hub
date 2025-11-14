import React from 'react'
import { IconButton, Tooltip } from '@mui/material'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import { ColorModeContext } from '../ColorModeContext'

const labels: Record<string, string> = {
  system: 'System theme',
  light: 'Light theme',
  dark: 'Dark theme',
}

const ColorModeToggle: React.FC = () => {
  const { mode, cycleMode } = React.useContext(ColorModeContext)

  const icon = mode === 'system' ? <AutoAwesomeIcon /> : mode === 'light' ? <LightModeIcon /> : <DarkModeIcon />
  const nextLabel = `Current: ${labels[mode]} (click to change)`

  return (
    <Tooltip title={nextLabel} enterDelay={300}>
      <IconButton color="inherit" onClick={cycleMode} aria-label="toggle color mode">
        {icon}
      </IconButton>
    </Tooltip>
  )
}

export default ColorModeToggle
