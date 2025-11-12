import React, { useState, useEffect, useRef } from 'react'
import { Paper, Typography, Box, Button } from '@mui/material'

type Die = { id: number; value: number; held: boolean }

const newDie = (id: number): Die => ({
  id,
  value: Math.ceil(Math.random() * 6),
  held: false,
})

const generateDice = () => Array.from({ length: 10 }, (_, i) => newDie(i))

// small confetti piece generator using CSS + absolute elements
const Confetti: React.FC<{ onDone?: () => void }> = ({ onDone }) => {
  const pieces = Array.from({ length: 24 })
  useEffect(() => {
    const t = setTimeout(() => onDone && onDone(), 1500)
    return () => clearTimeout(t)
  }, [onDone])
  return (
    <Box sx={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {pieces.map((_, i) => {
        const left = Math.random() * 80 + 10
        const bg = ['#f44336', '#e91e63', '#ffeb3b', '#4caf50', '#2196f3'][
          i % 5
        ]
        const delay = Math.random() * 600
        const dur = 900 + Math.random() * 700
        return (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              left: `${left}%`,
              top: 0,
              width: 10,
              height: 14,
              background: bg,
              transform: `rotate(${Math.random() * 360}deg)`,
              borderRadius: 1,
              animation: `confetti-fall ${dur}ms ${delay}ms forwards linear`,
            }}
          />
        )
      })}
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 1 }
          100% { transform: translateY(140vh) rotate(360deg); opacity: 0 }
        }
      `}</style>
    </Box>
  )
}

const Tenzies: React.FC = () => {
  const [dice, setDice] = useState<Die[]>(generateDice())
  const [rolling, setRolling] = useState(false)
  const [won, setWon] = useState(false)
  const [rolls, setRolls] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const bestKey = 'tenzies_best_rolls'
  const [best, setBest] = useState<number | null>(() => {
    try {
      const v = localStorage.getItem(bestKey)
      return v ? Number(v) : null
    } catch {
      return null
    }
  })

  const rollingRef = useRef(false)

  useEffect(() => {
    const allHeld = dice.every((d) => d.held)
    const first = dice[0].value
    const allSame = dice.every((d) => d.value === first)
    if (allHeld && allSame && dice.length > 0) {
      setWon(true)
      setShowConfetti(true)
      // persist best score
      setBest((prev) => {
        const candidate = prev === null ? rolls : Math.min(prev, rolls)
        try {
          localStorage.setItem(bestKey, String(candidate))
        } catch {}
        return candidate
      })
    }
  }, [dice, rolls])

  const roll = () => {
    if (won) {
      setDice(generateDice())
      setWon(false)
      setRolls(0)
      setShowConfetti(false)
      return
    }
    // animate roll: apply temporary "rolling" class to non-held dice
    setRolling(true)
    rollingRef.current = true
    setDice((prev) =>
      prev.map((d) =>
        d.held ? d : { ...d, value: Math.ceil(Math.random() * 6) }
      )
    )
    setRolls((r) => r + 1)
    setTimeout(() => {
      setRolling(false)
      rollingRef.current = false
    }, 420)
  }

  const toggleHold = (id: number) => {
    setDice((prev) =>
      prev.map((d) => (d.id === id ? { ...d, held: !d.held } : d))
    )
  }

  return (
    <Paper sx={{ p: 2, position: 'relative', overflow: 'visible' }}>
      <Typography variant="h6">Tenzies</Typography>
      <Typography variant="body2">
        Hold dice and roll until all dice show the same number.
      </Typography>
      <Box
        sx={{
          mt: 2,
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 64px)',
          gap: 1,
        }}
      >
        {dice.map((d) => (
          <Box
            key={d.id}
            onClick={() => toggleHold(d.id)}
            sx={{
              width: 64,
              height: 64,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: d.held ? '#a5d6a7' : '#fff',
              border: '2px solid #ccc',
              borderRadius: 2,
              fontSize: 24,
              cursor: 'pointer',
              transform:
                rolling && !d.held ? 'scale(1.08) rotate(10deg)' : 'none',
              transition:
                'transform 320ms cubic-bezier(.2,.8,.2,1), background 180ms ease',
              boxShadow: d.held
                ? '0 6px 12px rgba(0,0,0,0.14)'
                : '0 2px 4px rgba(0,0,0,0.06)',
              userSelect: 'none',
            }}
          >
            {d.value}
          </Box>
        ))}
      </Box>
      <Box sx={{ mt: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
        <Button variant="contained" onClick={roll}>
          {won ? 'New Game' : 'Roll'}
        </Button>
        <Box sx={{ ml: 2 }}>Rolls: {rolls}</Box>
        <Box sx={{ ml: 'auto' }}>Best: {best === null ? '-' : best}</Box>
      </Box>
      {won && (
        <Box sx={{ mt: 2, p: 2, background: '#e6ffe6', borderRadius: 1 }}>
          <Typography>🎉 You won in {rolls} rolls!</Typography>
        </Box>
      )}
      {showConfetti && <Confetti onDone={() => setShowConfetti(false)} />}
    </Paper>
  )
}

export default Tenzies
