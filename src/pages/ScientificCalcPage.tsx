import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Stack } from '@mui/material';
import { trigSin, trigCos, trigTan, log10, ln } from '../utils/extraConversions';

const ScientificCalcPage: React.FC = () => {
  const [value, setValue] = useState(1);
  const [base, setBase] = useState(2);
  const [exp, setExp] = useState(8);
  return (
    <Card variant="outlined" sx={{ maxWidth: 700 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>Vitenskapelig kalkulator</Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom><b> </b> Vis trigonometriske og logaritmiske verdier samt potensberegning.</Typography>
        <Stack spacing={2}>
          <TextField type="number" label="Tall" fullWidth value={value} onChange={e => setValue(+e.target.value)} />
          <Typography>sin: {trigSin(value).toFixed(6)}</Typography>
          <Typography>cos: {trigCos(value).toFixed(6)}</Typography>
            <Typography>tan: {trigTan(value).toFixed(6)}</Typography>
          <Typography>log10: {log10(value).toFixed(6)}</Typography>
          <Typography>ln: {ln(value).toFixed(6)}</Typography>
          <TextField type="number" label="Grunnlag" fullWidth value={base} onChange={e => setBase(+e.target.value)} />
          <TextField type="number" label="Eksponent" fullWidth value={exp} onChange={e => setExp(+e.target.value)} />
          <Typography>Potens: {Math.pow(base, exp)}</Typography>
        </Stack>
        <Typography variant="caption" mt={2}>Angitt verdi tolkes som radian for trigonometriske funksjoner.</Typography>
      </CardContent>
    </Card>
  );
};
export default ScientificCalcPage;
