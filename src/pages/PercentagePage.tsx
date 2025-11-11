import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Stack } from '@mui/material';
import { discount, increase, decrease } from '../utils/conversions';

const PercentagePage: React.FC = () => {
  const [value, setValue] = useState(100);
  const [pct, setPct] = useState(10);
  const { saved, final } = discount(value, pct);
  const inc = increase(value, pct);
  const dec = decrease(value, pct);
  return (
    <Card variant="outlined" sx={{ maxWidth: 600 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>Prosentkalkulator</Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          <b> </b> Kalkuler rabatt, økning og reduksjon i prosent. Skriv inn verdi og prosent.
        </Typography>
        <Stack spacing={2}>
          <TextField type="number" label="Verdi" fullWidth value={value} onChange={e => setValue(+e.target.value)} />
          <TextField type="number" label="Prosent" fullWidth value={pct} onChange={e => setPct(+e.target.value)} />
          <Typography>Rabatt: spar {saved} → sluttpris {final}</Typography>
          <Typography>Økt resultat: {inc}</Typography>
          <Typography>Redusert resultat: {dec}</Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};
export default PercentagePage;
