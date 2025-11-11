import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Stack } from '@mui/material';
import { lPer100kmToMpg, mpgToLPer100km } from '../utils/extraConversions';

const FuelEfficiencyPage: React.FC = () => {
  const [l100, setL100] = useState(6.5);
  return (
    <Card variant="outlined" sx={{ maxWidth: 620 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>Drivstoffeffektivitet</Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom><b>Om denne funksjonen:</b> Konverter mellom L/100km og miles per gallon (mpg, US).</Typography>
        <Stack spacing={2}>
          <TextField type="number" label="Liter per 100 km" fullWidth value={l100} onChange={e => setL100(+e.target.value)} />
          <Typography>mpg: {lPer100kmToMpg(l100).toFixed(2)}</Typography>
          <Typography>Eksempel: 30 mpg = {mpgToLPer100km(30).toFixed(2)} L/100km</Typography>
        </Stack>
        <Typography mt={2} variant="caption">Formel: mpg = 235.214583 / (L/100km)</Typography>
      </CardContent>
    </Card>
  );
};
export default FuelEfficiencyPage;
