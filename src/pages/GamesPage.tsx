import React, { useState, useEffect, useRef } from 'react'
import {
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  MenuItem,
  Divider,
} from '@mui/material'

// Tic-Tac-Toe
function calculateWinner(squares: string[]) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
      return squares[a]
  }
  return null
}

const GamesPage: React.FC = () => {
  const [activeGame, setActiveGame] = useState<
    'tictactoe' | 'memory' | 'rps' | 'guess' | 'coin' | 'reaction' | 'slot'
  >('tictactoe')
  // TicTacToe state
  const [board, setBoard] = useState<string[]>(Array(9).fill(''))
  const [xIsNext, setXIsNext] = useState(true)
  const winner = calculateWinner(board)

  const handleClick = (i: number) => {
    if (winner || board[i]) return
    const next = board.slice()
    next[i] = xIsNext ? 'X' : 'O'
    setBoard(next)
    setXIsNext(!xIsNext)
  }
  const reset = () => {
    setBoard(Array(9).fill(''))
    setXIsNext(true)
  }

  // Memory game dynamic difficulty
  const emojiPool = [
    '🍎',
    '⭐',
    '🐱',
    '⚽',
    '🚗',
    '�',
    '🎲',
    '🎹',
    '🥑',
    '🍕',
    '🧩',
    '�',
    '🎈',
    '�',
    '💎',
    '🪐',
  ]
  const [pairCount, setPairCount] = useState(4) // default 4 pairs (8 cards)
  const [cards, setCards] = useState<string[]>([])
  const [flipped, setFlipped] = useState<number[]>([])
  const [matched, setMatched] = useState<boolean[]>([])

  const buildDeck = (pairs: number) => {
    const chosen = emojiPool.slice(0, pairs)
    const deck = [...chosen, ...chosen]
    return deck.sort(() => Math.random() - 0.5)
  }

  const resetMemory = () => {
    const deck = buildDeck(pairCount)
    setCards(deck)
    setFlipped([])
    setMatched(Array(deck.length).fill(false))
  }

  useEffect(() => {
    resetMemory()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pairCount])

  const flip = (idx: number) => {
    if (matched[idx] || flipped.includes(idx)) return
    const newFlipped = [...flipped, idx]
    setFlipped(newFlipped)
    if (newFlipped.length === 2) {
      const [a, b] = newFlipped
      if (cards[a] === cards[b]) {
        const newMatched = matched.slice()
        newMatched[a] = newMatched[b] = true
        setMatched(newMatched)
        setTimeout(() => setFlipped([]), 500)
      } else {
        setTimeout(() => setFlipped([]), 800)
      }
    }
  }
  const allMatched = matched.length > 0 && matched.every((m) => m)

  // Rock-Paper-Scissors
  const rpsOptions = ['Stein', 'Papir', 'Saks'] as const
  type RPS = (typeof rpsOptions)[number]
  const [playerPick, setPlayerPick] = useState<RPS | null>(null)
  const [cpuPick, setCpuPick] = useState<RPS | null>(null)
  const [rpsResult, setRpsResult] = useState<string>('')
  const [animatingRps, setAnimatingRps] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [pendingPick, setPendingPick] = useState<RPS | null>(null)

  const emojiMap: Record<RPS, string> = {
    Stein: '✊',
    Papir: '✋',
    Saks: '✌️',
  }

  const playRps = (pick: RPS) => {
    // start animated countdown then reveal
    if (animatingRps) return
    setPendingPick(pick)
    setAnimatingRps(true)
    setCountdown(3)
    setPlayerPick(null)
    setCpuPick(null)
    setRpsResult('')

    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(interval)
          // reveal picks
          const cpu = rpsOptions[Math.floor(Math.random() * 3)]
          const finalPlayer = pick
          setPlayerPick(finalPlayer)
          setCpuPick(cpu)
          if (finalPlayer === cpu) setRpsResult('Uavgjort')
          else if (
            (finalPlayer === 'Stein' && cpu === 'Saks') ||
            (finalPlayer === 'Saks' && cpu === 'Papir') ||
            (finalPlayer === 'Papir' && cpu === 'Stein')
          )
            setRpsResult('Du vant!')
          else setRpsResult('Du tapte')
          // end animation after a short pause
          setTimeout(() => {
            setAnimatingRps(false)
            setPendingPick(null)
            setCountdown(0)
          }, 900)
          return 0
        }
        return c - 1
      })
    }, 450)
  }

  // Coin Flip
  const [coinResult, setCoinResult] = useState<'Krone' | 'Mynt' | null>(null)
  const [coinAnimating, setCoinAnimating] = useState(false)
  const flipCoin = () => {
    if (coinAnimating) return
    setCoinAnimating(true)
    setCoinResult(null)
    // short animation then reveal
    setTimeout(() => {
      const res = Math.random() < 0.5 ? 'Krone' : 'Mynt'
      setCoinResult(res)
      setCoinAnimating(false)
    }, 1000)
  }

  // Reaction Time
  const reactionTimeout = useRef<number | null>(null)
  const [reactionState, setReactionState] = useState<
    'idle' | 'waiting' | 'now' | 'result'
  >('idle')
  const startTimeRef = useRef<number | null>(null)
  const [reactionResult, setReactionResult] = useState<number | null>(null)
  const [bestReaction, setBestReaction] = useState<number | null>(null)

  const startReaction = () => {
    // begin waiting with random delay
    if (reactionState === 'waiting' || reactionState === 'now') return
    setReactionResult(null)
    setReactionState('waiting')
    const delay = 800 + Math.floor(Math.random() * 1800)
    reactionTimeout.current = window.setTimeout(() => {
      setReactionState('now')
      startTimeRef.current = performance.now()
    }, delay) as unknown as number
  }

  const stopReaction = () => {
    if (reactionState !== 'now') {
      // clicked too early
      if (reactionState === 'waiting') {
        // cancel and penalize
        if (reactionTimeout.current) {
          clearTimeout(reactionTimeout.current)
          reactionTimeout.current = null
        }
        setReactionState('idle')
        setReactionResult(null)
        return
      }
      return
    }
    const end = performance.now()
    const delta = Math.round(end - (startTimeRef.current || end))
    setReactionResult(delta)
    setBestReaction((prev) => (prev === null || delta < prev ? delta : prev))
    setReactionState('result')
    startTimeRef.current = null
  }

  useEffect(() => {
    return () => {
      if (reactionTimeout.current) {
        clearTimeout(reactionTimeout.current)
        reactionTimeout.current = null
      }
    }
  }, [])

  // Slot Machine
  const slotSymbols = ['🍒', '🍋', '🍊', '🔔', '7️⃣', '⭐']
  const [reels, setReels] = useState<string[]>([
    slotSymbols[0],
    slotSymbols[1],
    slotSymbols[2],
  ])
  const [spinning, setSpinning] = useState(false)
  const [slotResult, setSlotResult] = useState<string>('')
  const slotIntervalRef = useRef<number | null>(null)

  const spinSlot = () => {
    if (spinning) return
    setSpinning(true)
    setSlotResult('')
    const duration = 1400 + Math.floor(Math.random() * 800)
    slotIntervalRef.current = window.setInterval(() => {
      setReels([
        slotSymbols[Math.floor(Math.random() * slotSymbols.length)],
        slotSymbols[Math.floor(Math.random() * slotSymbols.length)],
        slotSymbols[Math.floor(Math.random() * slotSymbols.length)],
      ])
    }, 80) as unknown as number

    setTimeout(() => {
      if (slotIntervalRef.current) {
        clearInterval(slotIntervalRef.current)
        slotIntervalRef.current = null
      }
      const final = [
        slotSymbols[Math.floor(Math.random() * slotSymbols.length)],
        slotSymbols[Math.floor(Math.random() * slotSymbols.length)],
        slotSymbols[Math.floor(Math.random() * slotSymbols.length)],
      ]
      setReels(final)
      // evaluate
      if (final[0] === final[1] && final[1] === final[2])
        setSlotResult('Stor gevinst! 🎉')
      else if (
        final[0] === final[1] ||
        final[1] === final[2] ||
        final[0] === final[2]
      )
        setSlotResult('Liten gevinst! 😊')
      else setSlotResult('Ingen gevinst, prøv igjen.')
      setSpinning(false)
    }, duration)
  }

  // Guess Number
  const [guessMax, setGuessMax] = useState(50)
  const [secret, setSecret] = useState(
    () => Math.floor(Math.random() * guessMax) + 1
  )
  const [guess, setGuess] = useState<number | ''>('')
  const [guessFeedback, setGuessFeedback] = useState<string>('')
  const [attempts, setAttempts] = useState(0)
  const submitGuess = () => {
    if (guess === '') return
    const g = guess as number
    setAttempts((a) => a + 1)
    if (g === secret) {
      setGuessFeedback(`Riktig! Tallet var ${secret}. Forsøk: ${attempts + 1}`)
    } else if (g < secret) {
      setGuessFeedback('For lavt')
    } else {
      setGuessFeedback('For høyt')
    }
  }
  const resetGuessGame = () => {
    setSecret(Math.floor(Math.random() * guessMax) + 1)
    setGuess('')
    setGuessFeedback('')
    setAttempts(0)
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Enkle Spill
      </Typography>
      <Typography variant="body2" gutterBottom>
        Velg et spill: Tic-Tac-Toe, Memory, Stein-Papir-Saks eller Gjett Tallet.
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
        <Button
          variant={activeGame === 'tictactoe' ? 'contained' : 'outlined'}
          size="small"
          onClick={() => setActiveGame('tictactoe')}
        >
          Tic-Tac-Toe
        </Button>
        <Button
          variant={activeGame === 'memory' ? 'contained' : 'outlined'}
          size="small"
          onClick={() => setActiveGame('memory')}
        >
          Memory
        </Button>
        <Button
          variant={activeGame === 'rps' ? 'contained' : 'outlined'}
          size="small"
          onClick={() => setActiveGame('rps')}
        >
          Stein/Papir/Saks
        </Button>
        <Button
          variant={activeGame === 'guess' ? 'contained' : 'outlined'}
          size="small"
          onClick={() => setActiveGame('guess')}
        >
          Gjett Tallet
        </Button>
        <Button
          variant={activeGame === 'coin' ? 'contained' : 'outlined'}
          size="small"
          onClick={() => setActiveGame('coin')}
        >
          Myntkast
        </Button>
        <Button
          variant={activeGame === 'reaction' ? 'contained' : 'outlined'}
          size="small"
          onClick={() => setActiveGame('reaction')}
        >
          Reaksjonstid
        </Button>
        <Button
          variant={activeGame === 'slot' ? 'contained' : 'outlined'}
          size="small"
          onClick={() => setActiveGame('slot')}
        >
          Spilleautomat
        </Button>
      </Box>
      <Divider sx={{ my: 2 }} />
      {activeGame === 'tictactoe' && (
        <Box>
          <Typography variant="h6">Tic-Tac-Toe</Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3,80px)',
              gap: 1,
              mt: 1,
            }}
          >
            {board.map((val, i) => (
              <Box
                key={i}
                onClick={() => handleClick(i)}
                sx={{
                  width: 80,
                  height: 80,
                  border: '2px solid #444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 32,
                  cursor: 'pointer',
                  background: val ? '#e0ffe0' : '#fff',
                }}
              >
                {val}
              </Box>
            ))}
          </Box>
          <Typography sx={{ mt: 1 }}>
            {winner ? `Vinner: ${winner}` : `Neste: ${xIsNext ? 'X' : 'O'}`}
          </Typography>
          <Button
            variant="outlined"
            size="small"
            sx={{ mt: 1 }}
            onClick={reset}
          >
            Nullstill
          </Button>
        </Box>
      )}
      {activeGame === 'memory' && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">Memory</Typography>
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              flexWrap: 'wrap',
              mt: 1,
              alignItems: 'center',
            }}
          >
            <TextField
              select
              label="Par"
              value={pairCount}
              onChange={(e) => setPairCount(+e.target.value)}
              size="small"
              sx={{ width: 140 }}
            >
              <MenuItem value={4}>4 par (8 kort)</MenuItem>
              <MenuItem value={6}>6 par (12 kort)</MenuItem>
              <MenuItem value={8}>8 par (16 kort)</MenuItem>
            </TextField>
            <Button variant="contained" size="small" onClick={resetMemory}>
              Start / Nullstill
            </Button>
          </Box>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: `repeat(${pairCount <= 4 ? 4 : 4},70px)`,
              gap: 1,
              mt: 2,
            }}
          >
            {cards.map((card, idx) => (
              <Box
                key={idx}
                onClick={() => flip(idx)}
                sx={{
                  width: 70,
                  height: 70,
                  border: '2px solid #666',
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: matched[idx] || flipped.includes(idx) ? 32 : 0,
                  background: matched[idx] ? '#d0ffd0' : '#fafafa',
                  position: 'relative',
                  transition: 'font-size 0.25s',
                }}
              >
                {matched[idx] || flipped.includes(idx) ? card : ' '}
              </Box>
            ))}
          </Box>
          {allMatched && (
            <Typography sx={{ mt: 1 }}>Alle par funnet! 🎉</Typography>
          )}
          <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
            Totalt kort: {cards.length}
          </Typography>
        </Box>
      )}
      {activeGame === 'rps' && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">Stein • Papir • Saks</Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 1, alignItems: 'center' }}>
            {rpsOptions.map((opt) => (
              <Button
                key={opt}
                variant={
                  pendingPick === opt || playerPick === opt
                    ? 'contained'
                    : 'outlined'
                }
                disabled={animatingRps}
                onClick={() => playRps(opt)}
              >
                {opt}
              </Button>
            ))}
          </Box>

          <Box sx={{ mt: 2, display: 'flex', gap: 3, alignItems: 'center' }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="caption">Spiller</Typography>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  mt: 1,
                  borderRadius: 2,
                  border: '2px solid #333',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 36,
                  background: '#fff',
                  boxShadow: animatingRps
                    ? '0 10px 20px rgba(0,0,0,0.2)'
                    : '0 4px 8px rgba(0,0,0,0.12)',
                  transform: animatingRps
                    ? 'rotateY(360deg) scale(1.04)'
                    : 'none',
                  transition: 'transform 0.7s',
                }}
              >
                {playerPick
                  ? emojiMap[playerPick]
                  : animatingRps
                  ? '...'
                  : '❓'}
              </Box>
            </Box>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="caption">CPU</Typography>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  mt: 1,
                  borderRadius: 2,
                  border: '2px solid #333',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 36,
                  background: '#fff',
                  boxShadow: animatingRps
                    ? '0 10px 20px rgba(0,0,0,0.2)'
                    : '0 4px 8px rgba(0,0,0,0.12)',
                  transform: animatingRps
                    ? 'rotateY(-360deg) scale(1.04)'
                    : 'none',
                  transition: 'transform 0.7s',
                }}
              >
                {cpuPick
                  ? emojiMap[cpuPick as RPS]
                  : animatingRps
                  ? '...'
                  : '❓'}
              </Box>
            </Box>

            <Box sx={{ ml: 2 }}>
              {animatingRps && countdown > 0 && (
                <Typography variant="h3" sx={{ color: 'primary.main' }}>
                  {countdown}
                </Typography>
              )}
              {!animatingRps && rpsResult && (
                <Typography sx={{ mt: 1 }}>{rpsResult}</Typography>
              )}
            </Box>
          </Box>
        </Box>
      )}
      {activeGame === 'coin' && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">Myntkast</Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 1 }}>
            <Button
              variant="contained"
              onClick={flipCoin}
              disabled={coinAnimating}
            >
              {coinAnimating ? 'Kaster...' : 'Kast mynt'}
            </Button>
            {coinResult && (
              <Typography>
                {coinResult === 'Krone'
                  ? 'Krone (heads) 🪙'
                  : 'Mynt (tails) 🪙'}
              </Typography>
            )}
          </Box>
        </Box>
      )}

      {activeGame === 'reaction' && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">Reaksjonstid</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Trykk Start og vent på GO. Trykk så så raskt du kan.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 2 }}>
            <Button
              variant="contained"
              color={reactionState === 'now' ? 'error' : 'primary'}
              onClick={reactionState === 'now' ? stopReaction : startReaction}
            >
              {reactionState === 'idle' && 'Start'}
              {reactionState === 'waiting' && 'Vent...'}
              {reactionState === 'now' && 'Trykk!'}
              {reactionState === 'result' && 'Start igjen'}
            </Button>
            {reactionState === 'now' && (
              <Typography sx={{ ml: 1 }}>GO!</Typography>
            )}
            {reactionResult !== null && (
              <Typography>Tid: {reactionResult} ms</Typography>
            )}
            {bestReaction !== null && (
              <Typography sx={{ color: 'text.secondary' }}>
                Beste: {bestReaction} ms
              </Typography>
            )}
          </Box>
        </Box>
      )}

      {activeGame === 'slot' && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">Spilleautomat</Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 2 }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              {reels.map((r, i) => (
                <Box
                  key={i}
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: 1,
                    border: '2px solid #333',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 28,
                    background: '#fff',
                  }}
                >
                  {r}
                </Box>
              ))}
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button
                variant="contained"
                onClick={spinSlot}
                disabled={spinning}
              >
                {spinning ? 'Spinner...' : 'Spinn'}
              </Button>
              {slotResult && <Typography>{slotResult}</Typography>}
            </Box>
          </Box>
        </Box>
      )}
      {activeGame === 'guess' && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">Gjett Tallet</Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 1 }}>
            <TextField
              label="Maks"
              type="number"
              size="small"
              value={guessMax}
              onChange={(e) => {
                const v = +e.target.value || 1
                setGuessMax(v)
                setSecret(Math.floor(Math.random() * v) + 1)
                setGuess('')
                setGuessFeedback('')
                setAttempts(0)
              }}
            />
            <TextField
              label="Gjett"
              type="number"
              size="small"
              value={guess}
              onChange={(e) =>
                setGuess(e.target.value === '' ? '' : +e.target.value)
              }
            />
            <Button variant="contained" size="small" onClick={submitGuess}>
              Sjekk
            </Button>
            <Button variant="outlined" size="small" onClick={resetGuessGame}>
              Ny Runde
            </Button>
          </Box>
          {guessFeedback && (
            <Typography sx={{ mt: 1 }}>{guessFeedback}</Typography>
          )}
          <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
            Forsøk: {attempts}
          </Typography>
        </Box>
      )}
    </Paper>
  )
}

export default GamesPage
