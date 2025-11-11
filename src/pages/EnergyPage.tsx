import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Stack } from '@mui/material';
import { jouleToKcal, kcalToJoule, jouleToKWh } from '../utils/extraConversions';

const EnergyPage: React.FC = () => {
  const [joule, setJoule] = useState(4184);
  return (
    <Card variant="outlined" sx={{ maxWidth: 620 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>Energikonvertering</Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom><b>Om denne funksjonen:</b> Konverter energi mellom Joule, kilokalorier (kcal) og kWh.</Typography>
        <Stack spacing={2}>
          <TextField type="number" label="Joule" fullWidth value={joule} onChange={e => setJoule(+e.target.value)} />
          <Typography>kcal: {jouleToKcal(joule).toFixed(4)}</Typography>
          <Typography>kWh: {jouleToKWh(joule).toFixed(6)}</Typography>
        </Stack>
        <Typography mt={2} variant="caption">1 kcal = 4184 J | 1 kWh = 3 600 000 J. Eksempel: 1 kcal = {jouleToKWh(kcalToJoule(1)).toFixed(6)} kWh</Typography>
      </CardContent>
    </Card>
  );
};
export default EnergyPage;
