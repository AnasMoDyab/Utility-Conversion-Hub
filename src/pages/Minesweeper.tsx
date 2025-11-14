import React, { useState, useEffect } from 'react'
import { Paper, Typography, Box, Button, Select, MenuItem } from '@mui/material'

type Cell = {
  x: number
  y: number
  mine: boolean
  open: boolean
  flagged: boolean
  adjacent: number
}

const createBoard = (rows: number, cols: number, mines: number): Cell[] => {
  const total = rows * cols
  const cells: Cell[] = Array.from({ length: total }, (_, i) => ({
    x: i % cols,
    y: Math.floor(i / cols),
    mine: false,
    open: false,
    flagged: false,
    adjacent: 0,
  }))
  // place mines
  const positions = new Set<number>()
  while (positions.size < mines) {
    positions.add(Math.floor(Math.random() * total))
  }
  positions.forEach((p) => (cells[p].mine = true))
  // compute adjacent counts
  const get = (x: number, y: number) => cells[y * cols + x]
  for (const c of cells) {
    if (c.mine) continue
    let count = 0
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue
        const nx = c.x + dx
        const ny = c.y + dy
        if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
          if (get(nx, ny).mine) count++
        }
      }
    }
    c.adjacent = count
  }
  return cells
}

const revealRecursive = (cells: Cell[], cols: number, idx: number) => {
  const c = cells[idx]
  if (!c || c.open || c.flagged) return
  c.open = true
  if (c.adjacent === 0 && !c.mine) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue
        const nx = c.x + dx
        const ny = c.y + dy
        if (
          nx >= 0 &&
          nx < cols &&
          ny >= 0 &&
          ny < Math.floor(cells.length / cols)
        ) {
          revealRecursive(cells, cols, ny * cols + nx)
        }
      }
    }
  }
}

const Minesweeper: React.FC = () => {
  const [rows, setRows] = useState(9)
  const [cols, setCols] = useState(9)
  const [mines, setMines] = useState(10)
  const [board, setBoard] = useState<Cell[]>(() =>
    createBoard(rows, cols, mines)
  )
  const [lost, setLost] = useState(false)
  const [won, setWon] = useState(false)
  const [flagsLeft, setFlagsLeft] = useState(mines)

  useEffect(() => {
    setBoard(createBoard(rows, cols, mines))
    setLost(false)
    setWon(false)
    setFlagsLeft(mines)
  }, [rows, cols, mines])

  const openCell = (idx: number) => {
    if (lost || won) return
    const copy = board.slice()
    const c = copy[idx]
    if (c.flagged || c.open) return
    if (c.mine) {
      c.open = true
      setBoard(copy)
      setLost(true)
      return
    }
    revealRecursive(copy, cols, idx)
    setBoard(copy)
    // check win
    const unopened = copy.filter((x) => !x.open)
    if (unopened.length === mines) setWon(true)
  }

  const toggleFlag = (e: React.MouseEvent, idx: number) => {
    e.preventDefault()
    if (lost || won) return
    const copy = board.slice()
    const c = copy[idx]
    if (c.open) return
    c.flagged = !c.flagged
    setBoard(copy)
    setFlagsLeft(copy.filter((x) => x.flagged).length)
  }

  const reset = () => {
    setBoard(createBoard(rows, cols, mines))
    setLost(false)
    setWon(false)
    setFlagsLeft(mines)
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6">Minesweeper</Typography>
      <Box sx={{ display: 'flex', gap: 1, mt: 1, alignItems: 'center' }}>
        <Select value={rows} onChange={(e) => setRows(Number(e.target.value))}>
          <MenuItem value={9}>9 rows</MenuItem>
          <MenuItem value={16}>16 rows</MenuItem>
           <MenuItem value={30}>30 rows</MenuItem>
        </Select>
        <Select value={cols} onChange={(e) => setCols(Number(e.target.value))}>
          <MenuItem value={9}>9 cols</MenuItem>
          <MenuItem value={20}>20 cols</MenuItem>
          <MenuItem value={60}>60 cols</MenuItem>
        </Select>
        <Select
          value={mines}
          onChange={(e) => setMines(Number(e.target.value))}
        >
          <MenuItem value={10}>10 mines</MenuItem>
          <MenuItem value={20}>30 mines</MenuItem>
          <MenuItem value={60}>60 mines</MenuItem>
        </Select>
        <Button variant="contained" onClick={reset}>
          Reset
        </Button>
        <Box sx={{ ml: 'auto' }}>Flags: {flagsLeft}</Box>
      </Box>

      <Box
        sx={{
          mt: 2,
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, 28px)`,
          gap: 4,
        }}
      >
        {board.map((c, i) => (
          <Box
            key={i}
            onClick={() => openCell(i)}
            onContextMenu={(e) => toggleFlag(e, i)}
            sx={{
              width: 28,
              height: 28,
              background: c.open ? (c.mine ? 'red' : '#e8e8e8') : '#ccc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 1,
              boxShadow: c.open
                ? 'inset 0 0 0 2px rgba(0,0,0,0.06)'
                : '2px 2px 0 rgba(0,0,0,0.08)',
              transition: 'transform 120ms ease, background 120ms ease',
              transform: c.open ? 'scale(0.98)' : 'none',
              cursor: 'pointer',
              fontFamily: 'monospace',
            }}
          >
            {c.open && !c.mine && (c.adjacent > 0 ? c.adjacent : '')}
            {!c.open && c.flagged && '🚩'}
            {lost && c.mine && '💣'}
          </Box>
        ))}
      </Box>

      {won && (
        <Box sx={{ mt: 2, p: 2, background: '#e6ffe6', borderRadius: 1 }}>
          <Typography>🎉 You won!</Typography>
          <Button onClick={reset}>Play again</Button>
        </Box>
      )}
      {lost && (
        <Box sx={{ mt: 2, p: 2, background: '#ffe6e6', borderRadius: 1 }}>
          <Typography>💥 You hit a mine</Typography>
          <Button onClick={reset}>Try again</Button>
        </Box>
      )}
    </Paper>
  )
}

export default Minesweeper
