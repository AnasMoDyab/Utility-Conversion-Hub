import React, { useState, useEffect } from 'react'
import { Paper, Typography, Box, Button, useTheme } from '@mui/material'

type Tile = { id: number; value: number | null }

const SIZE = 4

const createSolved = (): Tile[] => {
  const arr: Tile[] = []
  for (let i = 1; i <= SIZE * SIZE - 1; i++) arr.push({ id: i, value: i })
  arr.push({ id: SIZE * SIZE, value: null })
  return arr
}

// Flattened index helpers
const indexToRowCol = (idx: number) => [Math.floor(idx / SIZE), idx % SIZE]
const rowColToIndex = (r: number, c: number) => r * SIZE + c

// Count inversions to test solvability
function isSolvable(values: (number | null)[]) {
  const arr = values.filter((v) => v !== null) as number[]
  let inv = 0
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] > arr[j]) inv++
    }
  }
  // blank row from bottom (1-based)
  const blankIndex = values.indexOf(null)
  const blankRowFromBottom = SIZE - Math.floor(blankIndex / SIZE)
  if (SIZE % 2 === 1) return inv % 2 === 0
  // even grid
  return (blankRowFromBottom % 2 === 0) ? inv % 2 === 1 : inv % 2 === 0
}

const shuffleSolvable = (): Tile[] => {
  let vals: (number | null)[] = []
  do {
    // create pool without using Array.keys to avoid downlevelIteration issues
    const pool: (number | null)[] = Array.from({ length: SIZE * SIZE }, (_, i) => (i === SIZE * SIZE - 1 ? null : i + 1))
    // Fisher-Yates
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[pool[i], pool[j]] = [pool[j], pool[i]]
    }
    vals = pool
  } while (!isSolvable(vals) || isSolved(vals))
  return vals.map((v, i) => ({ id: i + 1, value: v }))
}

const isSolved = (values: (number | null)[]) => {
  for (let i = 0; i < SIZE * SIZE - 1; i++) {
    if (values[i] !== i + 1) return false
  }
  return values[SIZE * SIZE - 1] === null
}

const Puzzle15: React.FC = () => {
  const [tiles, setTiles] = useState<Tile[]>(createSolved())
  const [moves, setMoves] = useState(0)
  const [won, setWon] = useState(false)

  useEffect(() => {
    // initialize shuffled board
    reset()
    // keyboard controls
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') moveByOffset(1, 0)
      if (e.key === 'ArrowDown') moveByOffset(-1, 0)
      if (e.key === 'ArrowLeft') moveByOffset(0, 1)
      if (e.key === 'ArrowRight') moveByOffset(0, -1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const vals = tiles.map((t) => t.value)
    if (isSolved(vals)) setWon(true)
    else setWon(false)
  }, [tiles])

  const reset = () => {
    setTiles(shuffleSolvable())
    setMoves(0)
    setWon(false)
  }

  const moveByOffset = (dr: number, dc: number) => {
    // move the tile adjacent to blank in the direction (dr,dc)
    const blankIdx = tiles.findIndex((t) => t.value === null)
    const [br, bc] = indexToRowCol(blankIdx)
    const srcR = br + dr
    const srcC = bc + dc
    if (srcR < 0 || srcR >= SIZE || srcC < 0 || srcC >= SIZE) return
    const srcIdx = rowColToIndex(srcR, srcC)
    moveTile(srcIdx)
  }

  const moveTile = (srcIdx: number) => {
    const blankIdx = tiles.findIndex((t) => t.value === null)
    // allow move only if adjacent
    const [sr, sc] = indexToRowCol(srcIdx)
    const [br, bc] = indexToRowCol(blankIdx)
    const dist = Math.abs(sr - br) + Math.abs(sc - bc)
    if (dist !== 1) return
    const next = tiles.slice()
    ;[next[blankIdx], next[srcIdx]] = [next[srcIdx], next[blankIdx]]
    setTiles(next)
    setMoves((m) => m + 1)
  }

  const theme = useTheme()

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6">15 Puzzle</Typography>
      <Typography variant="body2">Arrange the tiles in order (1–15). Click a tile adjacent to the blank to slide it. Arrow keys also move tiles.</Typography>
      <Box sx={{ mt: 2, display: 'grid', gridTemplateColumns: `repeat(${SIZE}, 80px)`, gap: 1 }}>
        {tiles.map((t, i) => (
          <Box
            key={t.id}
            onClick={() => moveTile(i)}
            sx={{
              width: 80,
              height: 80,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: t.value === null ? 'transparent' : theme.palette.background.paper,
              border: t.value === null ? `1px dashed ${theme.palette.divider}` : `2px solid ${theme.palette.divider}`,
              borderRadius: 1,
              fontSize: 20,
              color: t.value === null ? theme.palette.text.secondary : theme.palette.text.primary,
              cursor: t.value === null ? 'default' : 'pointer',
              userSelect: 'none',
            }}
          >
            {t.value}
          </Box>
        ))}
      </Box>
      <Box sx={{ mt: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
        <Button variant="contained" onClick={reset}>Shuffle</Button>
        <Box sx={{ ml: 2 }}>Moves: {moves}</Box>
        <Box sx={{ ml: 'auto' }}>{won ? '🎉 Solved!' : ''}</Box>
      </Box>
    </Paper>
  )
}

export default Puzzle15
