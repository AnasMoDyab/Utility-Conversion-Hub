import React, { useState } from 'react';
import { Typography, Paper, TextField, Button } from '@mui/material';

const JSONToolsPage: React.FC = () => {
  const [raw, setRaw] = useState('{"navn":"Ola","alder":25}');
  const [formatted, setFormatted] = useState('');
  const [error, setError] = useState<string | null>(null);

  const format = () => {
    try {
      const obj = JSON.parse(raw);
      setFormatted(JSON.stringify(obj, null, 2));
      setError(null);
    } catch (e: any) {
      setError(e.message);
      setFormatted('');
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5">JSON Verktøy</Typography>
      <Typography variant="body2" gutterBottom>Formater og valider JSON tekst.</Typography>
      <TextField fullWidth multiline minRows={6} label="JSON" value={raw} onChange={e => setRaw(e.target.value)} sx={{ mt: 2 }} />
      <Button variant="contained" sx={{ mt: 2 }} onClick={format}>Formater / Valider</Button>
      {error && <Typography color="error" sx={{ mt: 2 }}>Feil: {error}</Typography>}
      {formatted && <TextField fullWidth multiline minRows={6} label="Formatert" value={formatted} sx={{ mt: 2 }} />}
    </Paper>
  );
};

export default JSONToolsPage;
