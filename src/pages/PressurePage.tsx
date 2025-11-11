import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Stack } from '@mui/material';
import { paToBar, paToPsi, barToPa, psiToPa } from '../utils/extraConversions';

const PressurePage: React.FC = () => {
  const [pa, setPa] = useState(101325);
  return (
    <Card variant="outlined" sx={{ maxWidth: 620 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>Trykkonvertering</Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom><b>Om denne funksjonen:</b> Konverter mellom Pascal, Bar og PSI.</Typography>
        <Stack spacing={2}>
          <TextField type="number" label="Pascal (Pa)" fullWidth value={pa} onChange={e => setPa(+e.target.value)} />
          <Typography>Bar: {paToBar(pa).toFixed(5)}</Typography>
          <Typography>PSI: {paToPsi(pa).toFixed(4)}</Typography>
        </Stack>
        <Typography mt={2} variant="caption">Omvendt: 1 bar = {barToPa(1)} Pa | 1 PSI = {psiToPa(1).toFixed(2)} Pa</Typography>
      </CardContent>
    </Card>
  );
};
export default PressurePage;
