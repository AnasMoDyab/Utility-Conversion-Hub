import React from 'react'
import { IconButton, Tooltip } from '@mui/material'
import ContrastIcon from '@mui/icons-material/Contrast'
import { ColorModeContext } from '../ColorModeContext'

const HighContrastToggle: React.FC = () => {
  const { highContrast, toggleHighContrast } = React.useContext(ColorModeContext)
  return (
    <Tooltip title={highContrast ? 'Disable high contrast' : 'Enable high contrast'}>
      <IconButton color={highContrast ? 'secondary' : 'inherit'} onClick={toggleHighContrast} aria-label="toggle high contrast">
        <ContrastIcon />
      </IconButton>
    </Tooltip>
  )
}

export default HighContrastToggle
