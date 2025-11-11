import React, { useState } from 'react';
import { Typography, Paper, TextField, Box, Button } from '@mui/material';

const Base64Page: React.FC = () => {
  const [input, setInput] = useState('Hei verden');
  const [output, setOutput] = useState('');

  const encode = () => {
    try { setOutput(btoa(input)); } catch (e) { setOutput('Feil ved encoding'); }
  };
  const decode = () => {
    try { setOutput(atob(input)); } catch (e) { setOutput('Feil ved decoding'); }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5">Base64 Verktøy</Typography>
      <Typography variant="body2" gutterBottom>Encoder eller decoder tekst til/fra Base64.</Typography>
      <TextField fullWidth multiline minRows={3} label="Input" value={input} onChange={e => setInput(e.target.value)} sx={{ mt: 2 }} />
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Button variant="contained" onClick={encode}>Encode</Button>
        <Button variant="outlined" onClick={decode}>Decode</Button>
      </Box>
      {output && <TextField fullWidth multiline minRows={3} label="Output" value={output} sx={{ mt: 2 }} />}
    </Paper>
  );
};
export default Base64Page;
