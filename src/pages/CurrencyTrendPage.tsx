import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, MenuItem, TextField, Stack, Alert } from '@mui/material';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Registrer nødvendige moduler (fikser "category is not a registered scale")
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface HistoricalDay { date: string; rate: number; }
type TimeframeKey = '7d' | '30d' | '90d' | '365d';

const TIMEFRAMES: Record<TimeframeKey, number> = {
  '7d': 7,
  '30d': 30,
  '90d': 90,
  '365d': 365,
};

const CurrencyTrendPage: React.FC = () => {
  const [base, setBase] = useState('USD');
  const [target, setTarget] = useState('EUR');
  const [days, setDays] = useState<HistoricalDay[]>([]);
  const [timeframe, setTimeframe] = useState<TimeframeKey>('7d');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const key = process.env.REACT_APP_OXR_KEY;
  const currencies = ['USD','EUR','GBP','JPY','CAD','NOK','SEK','DKK'];
  const [invert, setInvert] = useState(false); // Vis kurs som target->base

  // Enkel cache for allerede hentede data per (target,timeframe)
  const cacheRef = React.useRef<Map<string, HistoricalDay[]>>(new Map());

  useEffect(() => {
    let active = true;
    async function load() {
      if (!key) { setError('Mangler API-nøkkel'); return; }
      const cacheKey = `${target}:${timeframe}`;
      setError(null);
      setLoading(true);
      if (cacheRef.current.has(cacheKey)) {
        setDays(cacheRef.current.get(cacheKey)!);
        setLoading(false);
        return;
      }
  const totalDays = TIMEFRAMES[timeframe];
      const today = new Date();
      // For å redusere antall API-kall ved lange perioder – sample
      let step = 1;
      if (totalDays > 120) step = 7; // ca ukentlig for 365d
      else if (totalDays > 40) step = 2; // annenhver dag for 90d
      const dateStrings: string[] = [];
      for (let i = totalDays - 1; i >= 0; i -= step) {
        const d = new Date(today.getTime() - i * 24 * 3600 * 1000);
        const dateStr = d.toISOString().substring(0, 10);
        dateStrings.push(dateStr);
      }
      try {
        const responses = await Promise.all(
          dateStrings.map(ds => axios.get(`https://openexchangerates.org/api/historical/${ds}.json?app_id=${key}`))
        );
        const arr: HistoricalDay[] = responses.map((r, idx) => {
          const rates = r.data.rates;
          // Alle rates er mot USD. For base->target: (rates[target] / rates[base])
          const rateBaseUSD = base === 'USD' ? 1 : rates[base];
          const rateTargetUSD = target === 'USD' ? 1 : rates[target];
          const direct = rateTargetUSD / rateBaseUSD;
          return { date: dateStrings[idx], rate: direct };
        }).filter(d => !!d.rate);
        if (active) {
          cacheRef.current.set(cacheKey, arr);
          setDays(arr);
        }
      } catch (e: any) {
        if (active) setError(e.message);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, [target, base, key, timeframe]);

  const chartData = {
    labels: days.map(d => d.date),
    datasets: [
      {
        label: invert ? `Kurs ${target}->${base}` : `Kurs ${base}->${target}`,
        data: days.map(d => invert ? (1 / d.rate) : d.rate),
        borderColor: '#3f51b5',
        backgroundColor: 'rgba(63,81,181,0.2)',
        tension: 0.25,
      }
    ]
  };

  const options = {
    responsive: true,
    interaction: { mode: 'index' as const, intersect: false },
    plugins: {
      legend: { position: 'bottom' as const },
      title: { display: false }
    },
    scales: {
      x: { type: 'category' as const },
      y: { beginAtZero: false }
    }
  };

  return (
    <Card variant="outlined" sx={{ maxWidth: 800 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>Valutatrend</Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom><b> </b> Viser historiske valutakurser (USD-basert) for valgt periode. Lange perioder samples for ytelse.</Typography>
        <Stack spacing={2}>
          <TextField select fullWidth label="Grunnvaluta" value={base} onChange={e => setBase(e.target.value)}>
            {currencies.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </TextField>
          <TextField select fullWidth label="Målvaluta" value={target} onChange={e => setTarget(e.target.value)}>
            {currencies.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </TextField>
          <TextField select fullWidth label="Periode" value={timeframe} onChange={e => setTimeframe(e.target.value as TimeframeKey)}>
            <MenuItem value="7d">Siste 7 dager</MenuItem>
            <MenuItem value="30d">Siste 30 dager</MenuItem>
            <MenuItem value="90d">Siste 3 måneder</MenuItem>
            <MenuItem value="365d">Siste år (ukentlig)</MenuItem>
          </TextField>
          <TextField select fullWidth label="Retning" value={invert ? 'invert' : 'normal'} onChange={e => setInvert(e.target.value === 'invert')}>
            <MenuItem value="normal">{base} → {target}</MenuItem>
            <MenuItem value="invert">{target} → {base}</MenuItem>
          </TextField>
          {error && <Alert severity="error">Feil: {error}</Alert>}
          {loading && !error && <Typography variant="caption">Laster data...</Typography>}
          {!loading && days.length > 0 && <Line data={chartData} options={options} />}
          {!loading && days.length === 0 && !error && <Typography variant="caption">Ingen data tilgjengelig.</Typography>}
        </Stack>
      </CardContent>
    </Card>
  );
};
export default CurrencyTrendPage;
