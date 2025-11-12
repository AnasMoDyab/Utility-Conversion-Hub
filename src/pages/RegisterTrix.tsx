import React, { useEffect, useState } from 'react'
import {
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

type Player = 'P1' | 'P2' | 'P3' | 'P4'
type Contract = 'King' | 'Diamonds' | 'Girls' | 'Collections' | 'Trex'

type DealEntry = {
  id: string
  contract: Contract
  owner: Player
  values: Record<Player, number> // raw inputs (positive for Trex finishing pos or counts/flags for others)
  scores: Record<Player, number> // computed scores for this deal
}

const CONTRACTS: Contract[] = ['King', 'Diamonds', 'Girls', 'Collections', 'Trex']

const DEFAULT_PLAYERS: Player[] = ['P1', 'P2', 'P3', 'P4']

function uid() {
  return Math.random().toString(36).slice(2, 9)
}

function computeScores(contract: Contract, values: Record<Player, number>) {
  const scores: Record<Player, number> = { P1: 0, P2: 0, P3: 0, P4: 0 }
  switch (contract) {
    case 'King': {
      // Determine the collector (values[player] === 1). Collector gets -75.
      const collector = DEFAULT_PLAYERS.find((p) => values[p] === 1)
      if (collector) {
        scores[collector] = -75
      }
      break
    }
    case 'Diamonds': {
      // values[player] = count of diamonds taken -> each diamond -10 points
      DEFAULT_PLAYERS.forEach((p) => {
        const cnt = values[p] || 0
        scores[p] = -10 * cnt
      })
      break
    }
    case 'Girls': {
      // values[player] = number of queens taken -> -25 each
      DEFAULT_PLAYERS.forEach((p) => {
        const cnt = values[p] || 0
        scores[p] = -25 * cnt
      })
      break
    }
    case 'Collections': {
      // values[player] = number of tricks taken -> -15 each
      DEFAULT_PLAYERS.forEach((p) => {
        const cnt = values[p] || 0
        scores[p] = -15 * cnt
      })
      break
    }
    case 'Trex': {
      // For Trex, values[player] = place: 1 -> +200, 2 -> +150, 3 -> +100, 4 -> +50
      const placeToScore: Record<number, number> = { 1: 200, 2: 150, 3: 100, 4: 50 }
      DEFAULT_PLAYERS.forEach((p) => {
        const place = values[p] || 0
        scores[p] = placeToScore[place] ?? 0
      })
      break
    }
  }
  return scores
}

const CONTRACT_MAX: Record<Contract, number | null> = {
  King: 1,
  Diamonds: 13,
  Girls: 4,
  Collections: 13,
  Trex: null,
}

const STORAGE_KEY = 'trix_register_v1'

// track per-kingdom used contracts: owner -> set of contracts
type KingdomUsage = Record<Player, Contract[]>
const EMPTY_USAGE: KingdomUsage = { P1: [], P2: [], P3: [], P4: [] }

const RegisterTrix: React.FC = () => {
  const [contract, setContract] = useState<Contract>('King')
  const [owner, setOwner] = useState<Player>('P1')
  const [inputs, setInputs] = useState<Record<Player, number>>({ P1: 0, P2: 0, P3: 0, P4: 0 })
  const [deals, setDeals] = useState<DealEntry[]>([])
  const [usage, setUsage] = useState<KingdomUsage>(EMPTY_USAGE)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as { deals: DealEntry[]; usage?: KingdomUsage }
        setDeals(parsed.deals || [])
        setUsage(parsed.usage || EMPTY_USAGE)
      } catch (e) {
        // ignore
      }
    }
  }, [])

  useEffect(() => {
    // persist deals and usage together
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ deals, usage }))
  }, [deals, usage])

  function addDeal() {
    // Prevent adding a contract already used in this owner's kingdom
    const used = usage[owner] || []
    if (used.includes(contract)) {
      // Do not add, silently ignore for now - could show notification
      setError('Contract already used in this kingdom')
      return
    }

    // Trex validation: ensure inputs are permutation of 1..4
    if (contract === 'Trex') {
      const places = DEFAULT_PLAYERS.map((p) => inputs[p] || 0)
      const unique = new Set(places)
      const validRange = places.every((v) => Number.isInteger(v) && v >= 1 && v <= 4)
      if (unique.size !== 4 || !validRange) {
        setError('Trex requires unique places 1,2,3,4 for the players')
        return
      }
    }

  setError(null)
  const scores = computeScores(contract, inputs)
    const entry: DealEntry = { id: uid(), contract, owner, values: { ...inputs }, scores }
    setDeals((d) => [entry, ...d])
    setUsage((u) => ({ ...u, [owner]: [...(u[owner] || []), contract] }))
    // reset inputs
    setInputs({ P1: 0, P2: 0, P3: 0, P4: 0 })
  }

  function handleInputChange(player: Player, raw: number) {
    const max = CONTRACT_MAX[contract]
    // For Trex (no aggregate max) just set directly
    if (max === null) {
      // Trex: only allow values 0 (unset) or 1..4
      const v = raw ? Math.max(1, Math.min(4, Math.trunc(raw))) : 0
      setInputs((s) => ({ ...s, [player]: v }))
      return
    }

    // For King: only allow 0 or 1 across all players (who collected)
    if (contract === 'King') {
      // set this player to 1 and others to 0
      const newVals: Record<Player, number> = { P1: 0, P2: 0, P3: 0, P4: 0 }
      if (raw === 1) newVals[player] = 1
      setInputs(newVals)
      return
    }

    // For aggregate-limited contracts (Diamonds, Girls, Collections)
    // Ensure sum does not exceed max. If it would, cap this player's value so total == max.
    const otherSum = DEFAULT_PLAYERS.reduce((acc, p) => (p === player ? acc : acc + (inputs[p] || 0)), 0)
    const allowed = Math.max(0, (max as number) - otherSum)
    const newVal = Math.max(0, Math.min(raw, allowed))
    setInputs((s) => ({ ...s, [player]: newVal }))
  }

  function removeDeal(id: string) {
    // when removing a deal, remove its contract from the owner's usage as well
    setDeals((d) => {
      const toRemove = d.find((x) => x.id === id)
      if (!toRemove) return d
      setUsage((u) => ({ ...u, [toRemove.owner]: u[toRemove.owner].filter((c) => c !== toRemove.contract) }))
      return d.filter((x) => x.id !== id)
    })
  }

  function resetAll() {
    setDeals([])
    setUsage(EMPTY_USAGE)
    localStorage.removeItem(STORAGE_KEY)
  }

  function runningTotals() {
    const totals: Record<Player, number> = { P1: 0, P2: 0, P3: 0, P4: 0 }
    deals.slice().reverse().forEach((deal) => {
      DEFAULT_PLAYERS.forEach((p) => {
        totals[p] += deal.scores[p] || 0
      })
    })
    return totals
  }

  function partnerTotals(totals: Record<Player, number>) {
    return {
      team13: totals.P1 + totals.P3,
      team24: totals.P2 + totals.P4,
    }
  }

  const totals = runningTotals()
  const partners = partnerTotals(totals)

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Trix Register
      </Typography>

      <Box sx={{ mb: 2, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '320px 1fr' }, gap: 2 }}>
        <Box>
          <FormControl fullWidth sx={{ mb: 1 }}>
            <InputLabel>Kingdom Owner</InputLabel>
            <Select value={owner} label="Kingdom Owner" onChange={(e) => setOwner(e.target.value as Player)}>
              {DEFAULT_PLAYERS.map((p) => (
                <MenuItem key={p} value={p}>
                  {p}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Contract</InputLabel>
            <Select
              value={contract}
              label="Contract"
              onChange={(e) => setContract(e.target.value as Contract)}
            >
              {CONTRACTS.map((c) => {
                const disabled = (usage[owner] || []).includes(c)
                return (
                  <MenuItem key={c} value={c} disabled={disabled}>
                    {c} {disabled ? ' (used in kingdom)' : ''}
                  </MenuItem>
                )
              })}
            </Select>
          </FormControl>
        </Box>

        <Box>
          <Typography variant="body2">Enter values for players (meaning depends on contract):</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            King: mark 1 for the player who collected the King of Hearts (they will get -75). For Diamonds/Girls/Collections enter counts. For Trex enter finishing place (1..4).
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
            {DEFAULT_PLAYERS.map((p) => (
              <TextField
                key={p}
                label={p}
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                type="number"
                value={inputs[p] ?? 0}
                onChange={(e) => handleInputChange(p, Number(e.target.value || 0))}
                size="small"
                sx={{ width: 100 }}
              />
            ))}
          </Box>

          {error && (
            <Typography color="error" variant="caption" sx={{ display: 'block', mt: 1 }}>
              {error}
            </Typography>
          )}

          {/* Remaining count display for limited contracts */}
          {CONTRACT_MAX[contract] !== null && (
            <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
              Remaining: {((CONTRACT_MAX[contract] as number) - DEFAULT_PLAYERS.reduce((a, p) => a + (inputs[p] || 0), 0))}
            </Typography>
          )}

          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            <Button variant="contained" onClick={addDeal}>
              Add Deal
            </Button>
            <Button variant="outlined" color="error" onClick={resetAll}>
              Reset All
            </Button>
          </Box>
        </Box>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1">Running Totals</Typography>
        <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
          {DEFAULT_PLAYERS.map((p) => (
            <Paper key={p} sx={{ p: 1, minWidth: 80 }}>
              <Typography variant="caption">{p}</Typography>
              <Typography variant="h6">{totals[p]}</Typography>
            </Paper>
          ))}
          <Paper sx={{ p: 1, minWidth: 160 }}>
            <Typography variant="caption">Partners</Typography>
            <Typography variant="body2">P1+P3: {partners.team13}</Typography>
            <Typography variant="body2">P2+P4: {partners.team24}</Typography>
          </Paper>
        </Box>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Contract</TableCell>
            <TableCell>Values (P1,P2,P3,P4)</TableCell>
            <TableCell>Scores (P1,P2,P3,P4)</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {deals.map((d) => (
              <TableRow key={d.id}>
                <TableCell>{d.contract} (owner: {d.owner})</TableCell>
                <TableCell>
                  {DEFAULT_PLAYERS.map((p) => `${p}:${d.values[p] ?? 0}`).join(', ')}
                </TableCell>
                <TableCell>
                  {DEFAULT_PLAYERS.map((p) => `${p}:${d.scores[p] ?? 0}`).join(', ')}
                </TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => removeDeal(d.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  )
}

export default RegisterTrix
