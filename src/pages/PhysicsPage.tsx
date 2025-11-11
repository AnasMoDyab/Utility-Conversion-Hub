import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Stack } from '@mui/material';
import { force, kineticEnergy, velocity } from '../utils/extraConversions';

const PhysicsPage: React.FC = () => {
  const [mass, setMass] = useState(10);
  const [accel, setAccel] = useState(9.81);
  const [dist, setDist] = useState(100);
  const [time, setTime] = useState(9.58);
  const [speed, setSpeed] = useState(15);
  return (
    <Card variant="outlined" sx={{ maxWidth: 720 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>Fysikkhjelper</Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom><b> </b> Enkel beregning av kraft (F=m·a), kinetisk energi og hastighet.</Typography>
        <Stack spacing={2}>
          <TextField type="number" label="Masse (kg)" fullWidth value={mass} onChange={e => setMass(+e.target.value)} />
          <TextField type="number" label="Akselerasjon (m/s²)" fullWidth value={accel} onChange={e => setAccel(+e.target.value)} />
          <Typography>Kraft: {force(mass, accel).toFixed(2)} N</Typography>
          <TextField type="number" label="Hastighet (m/s)" fullWidth value={speed} onChange={e => setSpeed(+e.target.value)} />
          <Typography>Kinetisk energi: {kineticEnergy(mass, speed).toFixed(2)} J</Typography>
          <TextField type="number" label="Distanse (m)" fullWidth value={dist} onChange={e => setDist(+e.target.value)} />
          <TextField type="number" label="Tid (s)" fullWidth value={time} onChange={e => setTime(+e.target.value)} />
          <Typography>Hastighet fra distanse/tid: {velocity(dist, time).toFixed(3)} m/s</Typography>
        </Stack>
        <Typography variant="caption" mt={2}>Resultatene er teoretiske og uten friksjonstap.</Typography>
      </CardContent>
    </Card>
  );
};
export default PhysicsPage;
