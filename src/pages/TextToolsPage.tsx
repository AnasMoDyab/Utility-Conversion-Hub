import React, { useState } from 'react';
import { Typography, Paper, TextField } from '@mui/material';

function stats(text: string) {
  const chars = text.length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  return { chars, words };
}

const TextToolsPage: React.FC = () => {
  const [text, setText] = useState('Skriv inn tekst her.');
  const { chars, words } = stats(text);

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Tegn og Ord Teller</Typography>
      <Typography variant="body2" gutterBottom>Tell tegn og ord i tekst for hurtig analyse.</Typography>
      <TextField fullWidth multiline minRows={6} label="Tekst" value={text} onChange={e => setText(e.target.value)} sx={{ mt: 2 }} />
      <Typography sx={{ mt: 2 }}>Tegn: {chars} • Ord: {words}</Typography>
    </Paper>
  );
};

export default TextToolsPage;
