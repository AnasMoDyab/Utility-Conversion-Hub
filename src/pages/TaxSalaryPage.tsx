import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Stack, MenuItem } from '@mui/material';

interface CountryConfig { taxRate: number; socialRate: number; }
const countries: Record<string, CountryConfig> = {
  'Norge': { taxRate: 25, socialRate: 8 },
  'Sverige': { taxRate: 27, socialRate: 7 },
  'Danmark': { taxRate: 30, socialRate: 6 },
};

const TaxSalaryPage: React.FC = () => {
  const [country, setCountry] = useState('Norge');
  const [gross, setGross] = useState(600000); // NOK annual
  const cfg = countries[country];
  const tax = gross * (cfg.taxRate/100);
  const social = gross * (cfg.socialRate/100);
  const net = gross - tax - social;
  return (
    <Card variant="outlined" sx={{ maxWidth: 700 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>Lønn & Skatt</Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom><b>Om denne funksjonen:</b> Grovt estimat av nettolønn etter skatt og sosiale avgifter (forenklede satser).</Typography>
        <Stack spacing={2}>
          <TextField select fullWidth label="Land" value={country} onChange={e => setCountry(e.target.value)}>
            {Object.keys(countries).map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </TextField>
          <TextField type="number" label="Bruttolønn (årlig)" fullWidth value={gross} onChange={e => setGross(+e.target.value)} />
          <Typography>Skatt: {tax.toFixed(2)} | Sosiale avgifter: {social.toFixed(2)}</Typography>
          <Typography>Nettolønn: {net.toFixed(2)}</Typography>
        </Stack>
        <Typography variant="caption" mt={2}>Tallene er forenklede og ikke juridisk korrekte. Bruk offisielle kalkulatorer for nøyaktighet.</Typography>
      </CardContent>
    </Card>
  );
};
export default TaxSalaryPage;
