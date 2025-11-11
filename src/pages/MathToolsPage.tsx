import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Stack } from '@mui/material';
import { factorial, power, sqrt } from '../utils/conversions';

const MathToolsPage: React.FC = () => {
  const [num, setNum] = useState(5);
  const [base, setBase] = useState(2);
  const [exp, setExp] = useState(3);
  return (
    <Card variant="outlined" sx={{ maxWidth: 600 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>Enkle matteverktøy</Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          <b>Om denne funksjonen:</b> Regn ut fakultet, kvadratrot og potens. Skriv inn tall og parametre.
        </Typography>
        <Stack spacing={2}>
          <TextField type="number" label="Tall" fullWidth value={num} onChange={e => setNum(+e.target.value)} />
          <Typography>Fakultet: {factorial(num)}</Typography>
          <Typography>Kvadratrot: {sqrt(num).toFixed(4)}</Typography>
          <TextField type="number" label="Grunnlag" fullWidth value={base} onChange={e => setBase(+e.target.value)} />
          <TextField type="number" label="Eksponent" fullWidth value={exp} onChange={e => setExp(+e.target.value)} />
          <Typography>Potens: {power(base, exp)}</Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};
export default MathToolsPage;
