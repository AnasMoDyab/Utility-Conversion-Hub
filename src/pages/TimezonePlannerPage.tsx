import React, { useState } from 'react'
import {
  Paper,
  Typography,
  TextField,
  Box,
  Button,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

// Fallback timezone list (abbreviated). When Intl.supportedValuesOf('timeZone') is available we use it.
const fallbackTimezones = [
  'UTC',
  'Europe/London',
  'Europe/Paris',
  'Europe/Oslo',
  'Europe/Berlin',
  'Europe/Madrid',
  'Europe/Rome',
  'Europe/Warsaw',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Toronto',
  'America/Sao_Paulo',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Asia/Hong_Kong',
  'Australia/Sydney',
]

function getTimezones(): string[] {
  // @ts-ignore - supportedValuesOf may not exist in TS lib yet
  if (typeof Intl !== 'undefined' && (Intl as any).supportedValuesOf) {
    try {
      return (Intl as any).supportedValuesOf('timeZone')
    } catch {
      /* ignore */
    }
  }
  return fallbackTimezones
}

interface Participant {
  id: number
  label: string
  tz: string
}

const TimezonePlannerPage: React.FC = () => {
  const [baseDate, setBaseDate] = useState<string>(() =>
    new Date().toISOString().slice(0, 16)
  ) // yyyy-MM-ddTHH:mm for datetime-local
  const [baseTz, setBaseTz] = useState<string>('UTC')
  const [participants, setParticipants] = useState<Participant[]>([
    { id: 1, label: 'You', tz: 'UTC' },
  ])
  const [newLabel, setNewLabel] = useState('Participant')
  const [newTz, setNewTz] = useState('Europe/Oslo')
  const [suggestions, setSuggestions] = useState<
    { window: string; participants: number }[]
  >([])

  const tzList = getTimezones()

  function addParticipant() {
    if (!newLabel.trim()) return
    setParticipants((p) => [
      ...p,
      { id: Date.now(), label: newLabel.trim(), tz: newTz },
    ])
    setNewLabel('')
  }
  function removeParticipant(id: number) {
    setParticipants((p) => p.filter((x) => x.id !== id))
  }

  function formatInTz(dateLocal: Date, tz: string) {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: tz,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      weekday: 'short',
      day: '2-digit',
      month: 'short',
    }).format(dateLocal)
  }

  function computeTimes() {
    const local = new Date(baseDate)
    return participants.map((p) => ({ ...p, display: formatInTz(local, p.tz) }))
  }

  // Simple suggestion: propose hours 07-18 UTC and count how many are inside 08-18 local time for each participant.
  function generateSuggestions() {
    const hours: { window: string; participants: number }[] = []
    for (let h = 6; h <= 20; h++) {
      const d = new Date(baseDate)
      d.setUTCHours(h, 0, 0, 0)
      const count = participants.reduce((acc, p) => {
        const localHour = Number(
          new Intl.DateTimeFormat('en-US', {
            timeZone: p.tz,
            hour: '2-digit',
            hour12: false,
          }).format(d)
        )
        return acc + (localHour >= 8 && localHour <= 18 ? 1 : 0)
      }, 0)
      hours.push({
        window: `${h.toString().padStart(2, '0')}:00 UTC`,
        participants: count,
      })
    }
    setSuggestions(
      hours.sort((a, b) => b.participants - a.participants).slice(0, 5)
    )
  }

  const computed = computeTimes()

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Timezone & Meeting Planner
      </Typography>
      <Typography variant="body2" gutterBottom>
        Plan a meeting time across multiple time zones. Add participants and see
        local times; get top suggested start hours.
      </Typography>
      <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          type="datetime-local"
          label="Base Date/Time (UTC reference)"
          value={baseDate}
          onChange={(e) => setBaseDate(e.target.value)}
          sx={{ minWidth: 260 }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="base-tz-label">Base Timezone</InputLabel>
          <Select
            labelId="base-tz-label"
            label="Base Timezone"
            value={baseTz}
            onChange={(e) => setBaseTz(e.target.value)}
          >
            {tzList.map((t) => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle1">Participants</Typography>
        <Box
          sx={{
            display: 'grid',
            gap: 1,
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' },
            mt: 1,
          }}
        >
          {participants.map((p) => (
            <Paper
              key={p.id}
              sx={{
                p: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {p.label}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {p.tz}
                </Typography>
                <Typography variant="caption" display="block">
                  {computed.find((c) => c.id === p.id)?.display}
                </Typography>
              </Box>
              <IconButton
                size="small"
                onClick={() => removeParticipant(p.id)}
                aria-label="remove"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Paper>
          ))}
        </Box>
        <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
          <TextField
            label="Label"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            sx={{ flexGrow: 1, minWidth: 140 }}
          />
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="new-tz-label">Timezone</InputLabel>
            <Select
              labelId="new-tz-label"
              label="Timezone"
              value={newTz}
              onChange={(e) => setNewTz(e.target.value)}
            >
              {tzList.map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" onClick={addParticipant}>
            Add
          </Button>
        </Box>
      </Box>

      <Box sx={{ mt: 3 }}>
        <Button variant="outlined" onClick={generateSuggestions}>
          Suggest Times
        </Button>
        {suggestions.length > 0 && (
          <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {suggestions.map((s) => (
              <Chip
                key={s.window}
                label={`${s.window} • ${s.participants}/${participants.length} avail`}
                color={s.participants > 0 ? 'primary' : 'default'}
              />
            ))}
          </Box>
        )}
      </Box>
    </Paper>
  )
}

export default TimezonePlannerPage
