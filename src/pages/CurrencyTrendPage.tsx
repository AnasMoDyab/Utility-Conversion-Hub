import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, MenuItem, TextField, Stack, Alert } from '@mui/material';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

interface HistoricalDay { date: string; rate: number; }

const CurrencyTrendPage: React.FC = () => {
  const [base] = useState('USD');
  const [target, setTarget] = useState('EUR');
  const [days, setDays] = useState<HistoricalDay[]>([]);
  const [error, setError] = useState<string | null>(null);
  const key = process.env.REACT_APP_OXR_KEY;
  const currencies = ['EUR','GBP','JPY','CAD','NOK','SEK','DKK'];

  useEffect(() => {
    async function load() {
      if (!key) { setError('Mangler API-nøkkel'); return; }
      setError(null);
      const today = new Date();
      const arr: HistoricalDay[] = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today.getTime() - i*24*3600*1000);
        const dateStr = d.toISOString().substring(0,10);
        try {
          const url = `https://openexchangerates.org/api/historical/${dateStr}.json?app_id=${key}`;
          const { data } = await axios.get(url);
          const rate = data.rates[target];
          arr.push({ date: dateStr, rate });
        } catch (e:any) {
          setError(e.message);
          break;
        }
      }
      setDays(arr);
    }
    load();
  }, [target, key]);

  const chartData = {
    labels: days.map(d => d.date),
    datasets: [
      {
        label: `Kurs ${base}->${target}`,
        data: days.map(d => d.rate),
        borderColor: '#3f51b5',
        backgroundColor: 'rgba(63,81,181,0.2)',
        tension: 0.25,
      }
    ]
  };

  return (
    <Card variant="outlined" sx={{ maxWidth: 800 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>Valutatrend</Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom><b>Om denne funksjonen:</b> Viser historiske daglige valutakurser siste 7 dager (USD-basert).</Typography>
        <Stack spacing={2}>
          <TextField select fullWidth label="Målvaluta" value={target} onChange={e => setTarget(e.target.value)}>
            {currencies.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </TextField>
          {error && <Alert severity="error">Feil: {error}</Alert>}
          {days.length > 0 && <Line data={chartData} />}
          {days.length === 0 && !error && <Typography variant="caption">Laster data...</Typography>}
        </Stack>
      </CardContent>
    </Card>
  );
};
export default CurrencyTrendPage;
