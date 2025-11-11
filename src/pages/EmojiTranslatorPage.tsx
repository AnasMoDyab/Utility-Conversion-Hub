import React, { useState } from 'react';
import { Paper, Typography, TextField, Button, Box } from '@mui/material';

const dictionary: Record<string,string> = {
  glad:'😀', trist:'😢', sol:'☀️', regn:'🌧️', bil:'🚗', mat:'🍽️', kaffe:'☕', katt:'🐱', hund:'🐶', penger:'💰', hjerte:'❤️', ild:'🔥'
};

function translate(text: string) {
  return text.split(/(\s+)/).map(part => {
    const clean = part.toLowerCase().replace(/[^a-zæøå]/gi,'');
    if (dictionary[clean]) return dictionary[clean];
    return part;
  }).join('');
}

const EmojiTranslatorPage: React.FC = () => {
  const [input, setInput] = useState('Jeg er glad og drikker kaffe i solen');
  const [output, setOutput] = useState('');

  return (
    <Paper sx={{ p:3 }}>
      <Typography variant="h5" gutterBottom>Emoji Oversetter</Typography>
      <Typography variant="body2" gutterBottom>Erstatt kjente ord med passende emoji.</Typography>
      <TextField fullWidth multiline minRows={3} label="Tekst" value={input} onChange={e=>setInput(e.target.value)} sx={{ mt:2 }} />
      <Button variant="contained" sx={{ mt:2 }} onClick={()=>setOutput(translate(input))}>Oversett</Button>
      {output && <Box sx={{ mt:2 }}><Typography variant="subtitle1">Resultat:</Typography><Typography>{output}</Typography></Box>}
      <Typography variant="caption" sx={{ mt:3, display:'block' }}>Ord støtte: {Object.keys(dictionary).join(', ')}</Typography>
    </Paper>
  );
};
export default EmojiTranslatorPage;
