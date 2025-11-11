import React, { useState } from 'react';
import { Paper, Typography, Button, Box } from '@mui/material';

const jokes = [
  'Hvorfor krysset kyllingen veien? For å komme til den andre siden!',
  'Jeg fortalte en vits om UDP... kanskje du får den?',
  'Programmerere foretrekker mørk modus fordi lyset tiltrekker bugs.'
];
const quotes = [
  'Det beste tidspunktet å plante et tre var for 20 år siden. Det nest beste er nå.',
  'Suksess er summen av små innsats hver dag.',
  'Handling er nøkkelen til all suksess.'
];

const JokeQuotePage: React.FC = () => {
  const [mode, setMode] = useState<'joke'|'quote'>('joke');
  const [text, setText] = useState<string>('Trykk for å generere!');

  const generate = () => {
    if (mode === 'joke') {
      setText(jokes[Math.floor(Math.random()*jokes.length)]);
    } else {
      setText(quotes[Math.floor(Math.random()*quotes.length)]);
    }
  };

  return (
    <Paper sx={{ p:3 }}>
      <Typography variant="h5" gutterBottom>Vits / Sitat Generator</Typography>
      <Typography variant="body2" gutterBottom>Generer en tilfeldig vits eller et inspirerende sitat.</Typography>
      <Box sx={{ display:'flex', gap:2, mt:2 }}>
        <Button variant={mode==='joke'?'contained':'outlined'} onClick={()=>setMode('joke')}>Vits</Button>
        <Button variant={mode==='quote'?'contained':'outlined'} onClick={()=>setMode('quote')}>Sitat</Button>
        <Button variant="contained" color="secondary" onClick={generate}>Generer</Button>
      </Box>
      <Typography sx={{ mt:3, fontStyle:'italic' }}>{text}</Typography>
    </Paper>
  );
};

export default JokeQuotePage;
