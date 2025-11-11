import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Stack } from '@mui/material';
import { unitPrice } from '../utils/conversions';

const UnitPricePage: React.FC = () => {
  const [total, setTotal] = useState(10);
  const [qty, setQty] = useState(2);
  const price = unitPrice(total, qty);
  return (
    <Card variant="outlined" sx={{ maxWidth: 600 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>Enhetspriskalkulator</Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          <b> </b> Sammenlign pris per enhet. Skriv inn totalpris og antall for å finne pris per enhet.
        </Typography>
        <Stack spacing={2}>
          <TextField type="number" label="Totalpris" fullWidth value={total} onChange={e => setTotal(+e.target.value)} />
          <TextField type="number" label="Antall" fullWidth value={qty} onChange={e => setQty(+e.target.value)} />
          <Typography>Pris per enhet: {isNaN(price) ? '' : price}</Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};
export default UnitPricePage;
