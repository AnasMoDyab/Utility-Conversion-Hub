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
  Chip,
  Tooltip,
  Divider,
  useMediaQuery
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
      setError('Contract already used in this kingdom')
      return
    }
    // Additional validation for Trex: ensure places are unique and within 1..4
    if (contract === 'Trex') {
      const places = DEFAULT_PLAYERS.map(p => inputs[p]).filter(v => v > 0)
      const unique = new Set(places)
      if (places.length !== unique.size) {
        setError('Trex places must be unique')
        return
      }
      if (places.some(p => p < 1 || p > 4)) {
        setError('Trex places must be between 1 and 4')
        return
      }
    }
    setError(null)
    const scores = computeScores(contract, inputs)
    const entry: DealEntry = { id: uid(), contract, owner, values: { ...inputs }, scores }
    setDeals(d => [entry, ...d])
    setUsage(u => ({ ...u, [owner]: [...(u[owner] || []), contract] }))
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

  // Helper for score chip colors
  const scoreTone = (v:number) => {
    if (v > 150) return 'success'
    if (v > 0) return 'primary'
    if (v === 0) return 'default'
    if (v < -50) return 'error'
    return 'warning'
  }

  // Adjusted palette for better contrast on dark background
  const contractColor: Record<Contract, string> = {
    King: '#c2185b',
    Diamonds: '#996515',
    Girls: '#673ab7',
    Collections: '#0d6efd',
    Trex: '#008f6f'
  }

  // Choose readable text color for chips based on luminance
  function readableText(bg:string){
    const h = bg.replace('#','')
    const r = parseInt(h.substring(0,2),16)
    const g = parseInt(h.substring(2,4),16)
    const b = parseInt(h.substring(4,6),16)
    const lum = (0.2126*r + 0.7152*g + 0.0722*b) / 255
    return lum > 0.55 ? '#111' : '#fff'
  }

  const isMobile = useMediaQuery('(max-width:600px)')

  return (
    <Box sx={{
      background: 'linear-gradient(135deg,#ffffff,#eef3f7 70%)',
      borderRadius: 4,
      p: { xs: 2, sm: 3 },
      boxShadow: '0 6px 18px -6px rgba(0,0,0,0.25)',
      color: '#1a2731'
    }}>
      <Typography variant="h4" sx={{ mb: 2, fontSize: { xs: '1.5rem', sm: '1.9rem' }, fontWeight: 700 }}>
        Trix Register
      </Typography>

    {/* Control Panel */}
    <Paper elevation={2} sx={{ mb: 3, p: { xs: 1.5, sm: 2 }, borderRadius: 3, background: '#ffffff', border: '1px solid #d7e0e7', color: '#1a2731' }}>
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '320px 1fr' } }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <FormControl fullWidth size="small">
              <InputLabel sx={{ color: 'primary.light' }}>Kingdom Owner</InputLabel>
              <Select value={owner} label="Kingdom Owner" onChange={(e) => setOwner(e.target.value as Player)}>
                {DEFAULT_PLAYERS.map((p) => (
                  <MenuItem key={p} value={p}>{p}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth size="small">
              <InputLabel>Contract</InputLabel>
              <Select value={contract} label="Contract" onChange={(e) => setContract(e.target.value as Contract)}>
                {CONTRACTS.map((c) => {
                  const disabled = (usage[owner] || []).includes(c)
                  return (
                    <MenuItem key={c} value={c} disabled={disabled}>
                      <Box sx={{ display:'flex', alignItems:'center', gap:1 }}>
                        <Box sx={{ width:12, height:12, borderRadius:'50%', background: contractColor[c], boxShadow:'0 0 0 2px rgba(255,255,255,0.15)' }} />
                        <Typography variant="body2" sx={{ color: readableText(contractColor[c]), bgcolor: contractColor[c], px:.75, py:.25, borderRadius:1, fontWeight:600 }}>
                          {c}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity:.6 }}>{disabled ? 'used' : ''}</Typography>
                      </Box>
                    </MenuItem>
                  )
                })}
              </Select>
            </FormControl>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="contained" size="small" onClick={addDeal} sx={{ textTransform:'none', fontWeight:600 }}>Add Deal</Button>
              <Button variant="outlined" size="small" color="error" onClick={resetAll} sx={{ textTransform:'none' }}>Reset</Button>
            </Box>
            {error && (
              <Typography color="error" variant="caption">{error}</Typography>
            )}
            <Divider sx={{ my: .5, opacity:.4 }} />
            <Box sx={{ display:'flex', flexWrap:'wrap', gap: .75 }}>
              {(usage[owner]||[]).map(u => (
                <Chip key={u} label={u} size="small" sx={{ bgcolor: contractColor[u], color: readableText(contractColor[u]), fontWeight:600 }} />
              ))}
              {usage[owner].length===0 && <Typography variant="caption" sx={{ opacity:.7 }}>No contracts used yet.</Typography>}
            </Box>
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ mb: .5, fontWeight:600 }}>Values per player</Typography>
            <Typography variant="caption" sx={{ display: 'block', lineHeight: 1.35, mb:1, color:'#4b5b67' }}>
              King: mark 1 for collector (-75). Diamonds/Girls/Collections = counts. Trex = place 1..4.
            </Typography>
            <Box sx={{ display:'grid', gap:1, gridTemplateColumns:{ xs:'repeat(2,1fr)', sm:'repeat(4,1fr)' } }}>
              {DEFAULT_PLAYERS.map(p => (
                <TextField
                  key={p}
                  label={p}
                  size="small"
                  type="number"
                  value={inputs[p] ?? 0}
                  onChange={(e)=> handleInputChange(p, Number(e.target.value || 0))}
                  inputProps={{ inputMode:'numeric', pattern:'[0-9]*' }}
                  sx={{
                    '& .MuiInputBase-root': { bgcolor:'#f5f7fa', color:'#1a2731', borderRadius:1 },
                    '& label': { color:'#5d6b75' },
                    '& .MuiInputBase-root.Mui-focused': { boxShadow:'0 0 0 2px #0056d633' },
                  }}
                />
              ))}
            </Box>
            {CONTRACT_MAX[contract] !== null && (
              <Typography variant="caption" sx={{ display:'block', mt:1, fontWeight:600 }}>
                Remaining: {(CONTRACT_MAX[contract] as number) - DEFAULT_PLAYERS.reduce((a,p)=> a + (inputs[p]||0),0)}
              </Typography>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Scoreboard */}
      <Box sx={{ mb:3 }}>
        <Typography variant="h6" sx={{ fontWeight:700, mb:1 }}>Running Totals</Typography>
        <Box sx={{ display:'grid', gap:1, gridTemplateColumns:{ xs:'repeat(2,1fr)', sm:'repeat(5, minmax(120px,1fr))' } }}>
          {DEFAULT_PLAYERS.map(p => (
            <Paper key={p} elevation={1} sx={{ p:1, textAlign:'center', background:'#ffffff', border:'1px solid #d7e0e7', borderRadius:2 }}>
              <Typography variant="caption" sx={{ fontWeight:600 }}>{p}</Typography>
              <Chip label={totals[p]} size="small" color={scoreTone(totals[p])} sx={{ mt:.4 }} />
            </Paper>
          ))}
          <Paper elevation={1} sx={{ p:1, background:'#ffffff', border:'1px solid #d7e0e7', borderRadius:2 }}>
            <Typography variant="caption" sx={{ fontWeight:600 }}>Partners</Typography>
            <Chip label={`P1+P3: ${partners.team13}`} size="small" color={scoreTone(partners.team13)} sx={{ mt:.4 }} />
            <Chip label={`P2+P4: ${partners.team24}`} size="small" color={scoreTone(partners.team24)} sx={{ mt:.4 }} />
          </Paper>
        </Box>
      </Box>

      {/* Deals listing - responsive */}
      {isMobile ? (
        <Box sx={{ display:'flex', flexDirection:'column', gap:1.25 }}>
          {deals.length === 0 && (
            <Typography variant="caption" sx={{ opacity:.7 }}>No deals recorded yet.</Typography>
          )}
          {deals.map(d => (
            <Paper key={d.id} elevation={1} sx={{ p:1.25, border:'1px solid #d7e0e7', borderRadius:2 }}>
              <Box sx={{ display:'flex', alignItems:'center', justifyContent:'space-between', mb:.75 }}>
                <Box sx={{ display:'flex', alignItems:'center', gap:.75 }}>
                  <Box sx={{ width:16, height:16, borderRadius:'50%', background: contractColor[d.contract] }} />
                  <Chip label={d.contract} size="small" sx={{ bgcolor:contractColor[d.contract], color: readableText(contractColor[d.contract]), fontWeight:600 }} />
                  <Typography variant="caption" sx={{ opacity:.6 }}>Owner: {d.owner}</Typography>
                </Box>
                <IconButton size="small" onClick={()=> removeDeal(d.id)} aria-label="delete" color="error">
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
              <Box sx={{ display:'grid', gap:.5, gridTemplateColumns:'repeat(2,1fr)', fontSize:'.7rem' }}>
                <Box>
                  <Typography variant="caption" sx={{ fontWeight:600 }}>Values</Typography>
                  <Typography variant="caption" display="block">
                    {DEFAULT_PLAYERS.map(p => `${p}:${d.values[p] ?? 0}`).join(', ')}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ fontWeight:600 }}>Scores</Typography>
                  <Typography variant="caption" display="block">
                    {DEFAULT_PLAYERS.map(p => `${p}:${d.scores[p] ?? 0}`).join(', ')}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      ) : (
        <Paper elevation={2} sx={{
          overflow:'hidden',
          borderRadius:3,
          background:'#ffffff',
          border:'1px solid #d7e0e7'
        }}>
          <Box sx={{ overflowX:'auto', WebkitOverflowScrolling:'touch' }}>
            <Table size="small" sx={{ minWidth:680 }}>
              <TableHead>
                <TableRow sx={{ background:'#0056d6', '& th':{ color:'#ffffff', fontWeight:600 } }}>
                  <TableCell sx={{ whiteSpace:'nowrap' }}>Contract / Owner</TableCell>
                  <TableCell>Values</TableCell>
                  <TableCell>Scores</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {deals.map(d => (
                  <TableRow key={d.id} hover sx={{ '&:nth-of-type(odd)': { background:'#f5f7fa' }, '&:nth-of-type(even)': { background:'#ffffff' } }}>
                    <TableCell sx={{ fontWeight:600 }}>
                      <Tooltip title={`Owner: ${d.owner}`}>
                        <Box sx={{ display:'flex', alignItems:'center', gap:.75 }}>
                          <Box sx={{ width:14, height:14, borderRadius:'50%', background: contractColor[d.contract], boxShadow:'0 0 0 2px #ffffff' }} />
                          <Chip label={d.contract} size="small" sx={{ bgcolor:contractColor[d.contract], color: readableText(contractColor[d.contract]), fontWeight:600 }} />
                          <Typography variant="caption" sx={{ opacity:.6 }}>({d.owner})</Typography>
                        </Box>
                      </Tooltip>
                    </TableCell>
                    <TableCell sx={{ fontSize:'0.75rem' }}>
                      {DEFAULT_PLAYERS.map(p => `${p}:${d.values[p] ?? 0}`).join(', ')}
                    </TableCell>
                    <TableCell sx={{ fontSize:'0.75rem' }}>
                      {DEFAULT_PLAYERS.map(p => `${p}:${d.scores[p] ?? 0}`).join(', ')}
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={()=> removeDeal(d.id)} aria-label="delete" color="error">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {deals.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <Typography variant="caption" sx={{ opacity:.7 }}>No deals recorded yet.</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Box>
        </Paper>
      )}
    </Box>
  )
}

export default RegisterTrix
