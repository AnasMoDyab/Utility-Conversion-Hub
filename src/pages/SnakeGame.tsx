import React, { useState, useEffect, useRef } from 'react'
import {
  Paper,
  Typography,
  Box,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material'

// Simple grid-based Snake game
const CELL_SIZE = 18 // px
const COLS = 30
const ROWS = 20

type Point = { x: number; y: number }

const randomPoint = (exclude: Point[]) => {
  while (true) {
    const p = {
      x: Math.floor(Math.random() * COLS),
      y: Math.floor(Math.random() * ROWS),
    }
    const found = exclude.some((e) => e.x === p.x && e.y === p.y)
    if (!found) return p
  }
}

const initialSnake = (): Point[] => [
  { x: Math.floor(COLS / 2), y: Math.floor(ROWS / 2) },
  { x: Math.floor(COLS / 2) - 1, y: Math.floor(ROWS / 2) },
]

const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>(initialSnake())
  const [dir, setDir] = useState<Point>({ x: 1, y: 0 })
  const [food, setFood] = useState<Point>(() => randomPoint(initialSnake()))
  const foodRef = useRef(food)
  const growRef = useRef(0)
  const [running, setRunning] = useState(false)
  const [score, setScore] = useState(0)
  const [speed, setSpeed] = useState(120) // ms per tick
  const [growthPerFood, setGrowthPerFood] = useState(2)
  const growthPerFoodRef = useRef(growthPerFood)
  const tickRef = useRef<number | null>(null)
  const dirRef = useRef(dir)

  useEffect(() => {
    dirRef.current = dir
  }, [dir])
  useEffect(() => {
    foodRef.current = food
  }, [food])
  useEffect(() => {
    growthPerFoodRef.current = growthPerFood
  }, [growthPerFood])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const k = e.key
      if (k === 'ArrowUp' || k === 'w' || k === 'W')
        setDir((d) => (d.y === 1 ? d : { x: 0, y: -1 }))
      if (k === 'ArrowDown' || k === 's' || k === 'S')
        setDir((d) => (d.y === -1 ? d : { x: 0, y: 1 }))
      if (k === 'ArrowLeft' || k === 'a' || k === 'A')
        setDir((d) => (d.x === 1 ? d : { x: -1, y: 0 }))
      if (k === 'ArrowRight' || k === 'd' || k === 'D')
        setDir((d) => (d.x === -1 ? d : { x: 1, y: 0 }))
      if (k === ' ') {
        setRunning((r) => !r)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  useEffect(() => {
    if (!running) {
      if (tickRef.current) {
        window.clearInterval(tickRef.current)
        tickRef.current = null
      }
      return
    }
    tickRef.current = window.setInterval(() => {
      setSnake((prev) => {
        const nextHead = {
          x: (prev[0].x + dirRef.current.x + COLS) % COLS,
          y: (prev[0].y + dirRef.current.y + ROWS) % ROWS,
        }
        const f = foodRef.current
        const willEat = nextHead.x === f.x && nextHead.y === f.y
        // willGrow = already queued growth or willEat
        const willGrow = growRef.current > 0 || willEat
        // collision with self: allow moving into tail if tail will move (i.e., not growing)
        const collision = prev.some((s, idx) => {
          // idx === last => tail
          if (!willGrow && idx === prev.length - 1) return false
          return s.x === nextHead.x && s.y === nextHead.y
        })
        if (collision) {
          setRunning(false)
          return prev
        }
        const newSnake = [nextHead, ...prev]
        if (!willGrow) newSnake.pop()
        else {
          // if we're eating, queue extra growth
          if (willEat) {
            growRef.current =
              (growRef.current || 0) + (growthPerFoodRef.current || 1)
            setScore((s) => s + 1)
            const newFood = randomPoint(newSnake)
            setFood(newFood)
            foodRef.current = newFood
            // speed up slightly
            setSpeed((sp) => Math.max(40, sp - 5))
            // restart interval with new speed
            if (tickRef.current) {
              window.clearInterval(tickRef.current)
              tickRef.current = null
            }
          }
          // consume one growth quota for this tick
          growRef.current = Math.max(0, growRef.current - 1)
        }
        return newSnake
      })
    }, speed)
    return () => {
      if (tickRef.current) {
        window.clearInterval(tickRef.current)
        tickRef.current = null
      }
    }
  }, [running, speed])

  const start = () => {
    setSnake(initialSnake())
    setFood(randomPoint(initialSnake()))
    setScore(0)
    setSpeed(120)
    setDir({ x: 1, y: 0 })
    setRunning(true)
  }
  const pause = () => setRunning(false)
  const reset = () => {
    setRunning(false)
    setSnake(initialSnake())
    setFood(randomPoint(initialSnake()))
    setScore(0)
    setSpeed(120)
    setDir({ x: 1, y: 0 })
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6">Snake</Typography>
      <Typography variant="body2">
        Use arrow keys or WASD. Space toggles pause.
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
        <Button variant="contained" onClick={start}>
          Start
        </Button>
        <Button variant="outlined" onClick={pause}>
          Pause
        </Button>
        <Button variant="outlined" onClick={reset}>
          Reset
        </Button>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel id="growth-label">Growth</InputLabel>
          <Select
            labelId="growth-label"
            value={growthPerFood}
            label="Growth"
            onChange={(e) => setGrowthPerFood(Number(e.target.value))}
          >
            <MenuItem value={1}>1 per food</MenuItem>
            <MenuItem value={2}>2 per food</MenuItem>
            <MenuItem value={3}>3 per food</MenuItem>
            <MenuItem value={4}>4 per food</MenuItem>
            <MenuItem value={5}>4 per food</MenuItem>
          </Select>
        </FormControl>
        <Box sx={{ ml: 'auto' }}>Score: {score}</Box>
      </Box>
      <Box
        sx={{
          mt: 2,
          width: COLS * CELL_SIZE,
          border: '2px solid #333',
          background: '#fafafa',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: COLS * CELL_SIZE,
            height: ROWS * CELL_SIZE,
          }}
        >
          {/* grid cells */}
          {Array.from({ length: ROWS }).map((_, r) =>
            Array.from({ length: COLS }).map((__, c) => (
              <Box
                key={`${r}-${c}`}
                sx={{
                  boxSizing: 'border-box',
                  position: 'absolute',
                  left: c * CELL_SIZE,
                  top: r * CELL_SIZE,
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  border: '1px solid #eee',
                }}
              />
            ))
          )}
          {/* food */}
          <Box
            sx={{
              position: 'absolute',
              left: food.x * CELL_SIZE,
              top: food.y * CELL_SIZE,
              width: CELL_SIZE,
              height: CELL_SIZE,
              background: 'tomato',
              borderRadius: 1,
            }}
          />
          {/* snake */}
          {snake.map((s, i) => (
            <Box
              key={i}
              sx={{
                position: 'absolute',
                left: s.x * CELL_SIZE,
                top: s.y * CELL_SIZE,
                width: CELL_SIZE,
                height: CELL_SIZE,
                background: i === 0 ? '#1e88e5' : '#90caf9',
                borderRadius: 1,
                transition: 'left 60ms linear, top 60ms linear',
              }}
            />
          ))}
        </Box>
      </Box>
    </Paper>
  )
}

export default SnakeGame
