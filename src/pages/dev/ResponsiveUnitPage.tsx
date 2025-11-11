import React, { useState } from 'react'
import {
  Paper,
  Typography,
  TextField,
  Box,
  Select,
  MenuItem,
} from '@mui/material'

const unitConvertValue = (
  val: number,
  from: 'px' | 'em' | 'rem' | '%',
  to: 'px' | 'em' | 'rem' | '%'
) => {
  const base = 16
  const toPx = (v: number, u: string) => {
    if (u === 'px') return v
    if (u === 'rem') return v * base
    if (u === 'em') return v * base
    if (u === '%') return (v / 100) * base
    return v
  }
  const fromPx = (v: number, u: string) => {
    if (u === 'px') return v
    if (u === 'rem') return v / base
    if (u === 'em') return v / base
    if (u === '%') return (v / base) * 100
    return v
  }
  const px = toPx(val, from)
  return fromPx(px, to)
}

const ResponsiveUnitPage: React.FC = () => {
  const [width, setWidth] = useState(1024)
  const [val, setVal] = useState(16)
  const [from, setFrom] = useState<'px' | 'em' | 'rem' | '%'>('px')
  const [to, setTo] = useState<'px' | 'em' | 'rem' | '%'>('rem')
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6">Responsive Tester & Unit Converter</Typography>
      <TextField
        label="Preview width (px)"
        type="number"
        value={width}
        onChange={(e) => setWidth(Number(e.target.value) || 320)}
        sx={{ mt: 1 }}
      />
      <Box
        sx={{
          mt: 1,
          border: '1px solid #ddd',
          width,
          height: 260,
          overflow: 'auto',
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography>Preview width: {width}px</Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 2 }}>
        <TextField
          type="number"
          value={val}
          onChange={(e) => setVal(Number(e.target.value) || 0)}
        />
        <Select value={from} onChange={(e) => setFrom(e.target.value as any)}>
          <MenuItem value={'px'}>px</MenuItem>
          <MenuItem value={'em'}>em</MenuItem>
          <MenuItem value={'rem'}>rem</MenuItem>
          <MenuItem value={'%'}>%</MenuItem>
        </Select>
        <Typography>→</Typography>
        <Select value={to} onChange={(e) => setTo(e.target.value as any)}>
          <MenuItem value={'px'}>px</MenuItem>
          <MenuItem value={'em'}>em</MenuItem>
          <MenuItem value={'rem'}>rem</MenuItem>
          <MenuItem value={'%'}>%</MenuItem>
        </Select>
        <Typography>{`${val}${from} = ${unitConvertValue(
          val,
          from,
          to
        )}${to}`}</Typography>
      </Box>
    </Paper>
  )
}
export default ResponsiveUnitPage
