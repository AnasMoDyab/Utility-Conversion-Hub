import React, { useState } from 'react';
import { Typography, Box, TextField, MenuItem, Paper } from '@mui/material';

// Simple MET values for sample activities
const activities: { label: string; value: string; MET: number }[] = [
  { label: 'Gange (moderat)', value: 'walk', MET: 3.5 },
  { label: 'Løping (rolig)', value: 'run', MET: 7.0 },
  { label: 'Sykling (moderat)', value: 'bike', MET: 6.0 },
  { label: 'Svømming', value: 'swim', MET: 8.0 },
  { label: 'Styrketrening', value: 'weights', MET: 5.0 },
];

const CalorieBurnPage: React.FC = () => {
  const [activity, setActivity] = useState('walk');
  const [weight, setWeight] = useState(70); // kg
  const [minutes, setMinutes] = useState(30);

  const selected = activities.find(a => a.value === activity)!;
  const hours = minutes / 60;
  const calories = selected.MET * weight * hours;

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Kaloriforbrenning</Typography>
      <Typography variant="body2" gutterBottom>
        Estimer kalorier brent basert på aktivitet, varighet og kroppsvekt. Formelen bruker MET: kalorier = MET * vekt(kg) * timer.
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
        <TextField select label="Aktivitet" value={activity} onChange={e => setActivity(e.target.value)}>
          {activities.map(a => <MenuItem key={a.value} value={a.value}>{a.label}</MenuItem>)}
        </TextField>
        <TextField type="number" label="Vekt (kg)" value={weight} onChange={e => setWeight(Number(e.target.value))} />
        <TextField type="number" label="Minutter" value={minutes} onChange={e => setMinutes(Number(e.target.value))} />
      </Box>
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6">Estimert kalorier: {calories.toFixed(0)} kcal</Typography>
        <Typography variant="caption">MET: {selected.MET} • Timer: {hours.toFixed(2)}</Typography>
      </Box>
    </Paper>
  );
};

export default CalorieBurnPage;
