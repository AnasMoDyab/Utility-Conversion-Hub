import React, { useState } from 'react';
import { Typography, Paper, Box, TextField, Checkbox, FormControlLabel, Button } from '@mui/material';

function generatePassword(length: number, opts: { upper: boolean; digits: boolean; symbols: boolean }) {
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digitChars = '0123456789';
  const symbolChars = '!@#$%^&*_-+=';
  let pool = lower;
  if (opts.upper) pool += upperChars;
  if (opts.digits) pool += digitChars;
  if (opts.symbols) pool += symbolChars;
  return Array.from({ length }, () => pool[Math.floor(Math.random() * pool.length)]).join('');
}

const RandomToolsPage: React.FC = () => {
  const [passLen, setPassLen] = useState(12);
  const [useUpper, setUseUpper] = useState(true);
  const [useDigits, setUseDigits] = useState(true);
  const [useSymbols, setUseSymbols] = useState(false);
  const [password, setPassword] = useState('');

  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [randNum, setRandNum] = useState<number | null>(null);
  const [dice, setDice] = useState<number | null>(null);
  const [rolling, setRolling] = useState(false);
  const diceFaces = ['⚀','⚁','⚂','⚃','⚄','⚅'];

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Tilfeldige Generatorer</Typography>
      <Typography variant="body2" gutterBottom>
        Generer passord, tilfeldige tall i intervall og terningkast.
      </Typography>
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6">Passordgenerator</Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 1 }}>
          <TextField label="Lengde" type="number" value={passLen} onChange={e => setPassLen(Number(e.target.value))} />
          <FormControlLabel control={<Checkbox checked={useUpper} onChange={e => setUseUpper(e.target.checked)} />} label="Store bokstaver" />
          <FormControlLabel control={<Checkbox checked={useDigits} onChange={e => setUseDigits(e.target.checked)} />} label="Tall" />
          <FormControlLabel control={<Checkbox checked={useSymbols} onChange={e => setUseSymbols(e.target.checked)} />} label="Symboler" />
          <Button variant="contained" onClick={() => setPassword(generatePassword(passLen, { upper: useUpper, digits: useDigits, symbols: useSymbols }))}>Generer</Button>
        </Box>
        {password && <Typography sx={{ mt: 1 }}><strong>Passord:</strong> {password}</Typography>}
      </Box>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Tilfeldig tall (intervall)</Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 1 }}>
          <TextField label="Min" type="number" value={min} onChange={e => setMin(Number(e.target.value))} />
          <TextField label="Max" type="number" value={max} onChange={e => setMax(Number(e.target.value))} />
          <Button variant="contained" onClick={() => setRandNum(Math.floor(Math.random() * (max - min + 1)) + min)}>Generer</Button>
        </Box>
        {randNum !== null && <Typography sx={{ mt: 1 }}>Resultat: {randNum}</Typography>}
      </Box>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Terningkast</Typography>
        <Button variant="contained" disabled={rolling} onClick={() => {
          setRolling(true);
          let ticks = 0;
          const interval = setInterval(() => {
            ticks++;
            setDice(Math.floor(Math.random() * 6) + 1);
            if (ticks > 14) { // duration of roll
              clearInterval(interval);
              setDice(Math.floor(Math.random() * 6) + 1);
              setRolling(false);
            }
          }, 70);
        }}>Kast</Button>
        {dice !== null && (
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{
              width: 180,
              height: 180,
              borderRadius: 3,
              border: '2px solid #4a7047',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 200,
              background: 'radial-gradient(circle at 30% 30%, #ffffff 0%, #cbe9c9 60%, #85b482 100%)',
              boxShadow: rolling ? '0 0 24px rgba(0,0,0,0.35), inset 0 0 12px rgba(255,255,255,0.6)' : '0 6px 14px rgba(0,0,0,0.25)',
              transform: rolling ? 'rotateX(720deg) rotateY(720deg)' : 'none',
              transition: 'transform 0.9s cubic-bezier(.34,1.56,.64,1), box-shadow 0.3s',
            }} aria-label={`Terning verdi ${dice}`}>
              {diceFaces[dice - 1]}
            </Box>
            <Typography variant="h6">Verdi: {dice}{rolling && ' (ruller...)'}</Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default RandomToolsPage;
