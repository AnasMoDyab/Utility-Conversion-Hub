import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Stack } from '@mui/material';
import { tipAndTax } from '../utils/conversions';

const TipTaxPage: React.FC = () => {
  const [amount, setAmount] = useState(100);
  const [tipPct, setTipPct] = useState(15);
  const [taxPct, setTaxPct] = useState(8);
  const res = tipAndTax(amount, tipPct, taxPct);
  return (
    <Card variant="outlined" sx={{ maxWidth: 600 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>Tips- og avgiftskalkulator</Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          <b> </b> Beregn tips og avgift på regningen. Skriv inn beløp, tipsprosent og avgiftsprosent.
        </Typography>
        <Stack spacing={2}>
          <TextField type="number" label="Regningsbeløp" fullWidth value={amount} onChange={e => setAmount(+e.target.value)} />
          <TextField type="number" label="Tips %" fullWidth value={tipPct} onChange={e => setTipPct(+e.target.value)} />
          <TextField type="number" label="Avgift %" fullWidth value={taxPct} onChange={e => setTaxPct(+e.target.value)} />
          <Typography>Tips: {res.tip} | Avgift: {res.tax} | Totalt: {res.total}</Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};
export default TipTaxPage;
