import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, TextField, MenuItem, Stack, Box, Alert } from '@mui/material';
import SkeletonSection from '../components/SkeletonSection';
import { fetchLatestRates, convert } from '../services/currency';

const Currency: React.FC = () => {
  const [amount, setAmount] = useState(1);
  const [result, setResult] = useState<number | null>(null);
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('EUR');
  const [rates, setRates] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'NOK', 'SEK', 'DKK'];

  useEffect(() => {
    setLoading(true);
    fetchLatestRates()
      .then(data => {
        setRates(data.rates);
        setError(null);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (rates && rates[from] && rates[to]) {
      setResult(convert(amount, from, to, rates));
    }
  }, [amount, from, to, rates]);

  return (
    <Card variant="outlined" sx={{ maxWidth: 600 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>Valutakalkulator</Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          <b> </b> Konverter beløp mellom valutaer ved hjelp av sanntidskurser fra Open Exchange Rates. Gratis-planen bruker alltid USD som basis.
        </Typography>
        {loading && <SkeletonSection lines={6} />}
        {error && <Alert severity="error">Feil ved henting av kurser: {error}</Alert>}
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField select fullWidth label="Fra" value={from} onChange={e => setFrom(e.target.value)}>
              {currencies.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </TextField>
            <TextField select fullWidth label="Til" value={to} onChange={e => setTo(e.target.value)}>
              {currencies.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </TextField>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField type="number" label="Beløp" fullWidth value={amount} onChange={e => setAmount(+e.target.value)} />
            <TextField label="Direkte kurs" fullWidth value={result === null ? '' : (rates[from] && rates[to] ? (rates[to] / rates[from]).toFixed(4) : '')} disabled />
          </Box>
          <Typography variant="h6">Resultat: {result === null || isNaN(result) ? '—' : `${result} ${to}`}</Typography>
          <Typography variant="caption" color="text.secondary">
            Kursgrunnlag: beløp / kurs({from}) → USD → kurs({to}). Data leveres av OpenExchangeRates.org.
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};
export default Currency;
