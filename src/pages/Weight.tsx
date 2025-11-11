import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Stack, Box } from '@mui/material';
import { kgToLb, lbToKg, kgToOz, ozToKg, kgToStone, stoneToKg } from '../utils/conversions';

const Weight: React.FC = () => {
  const [kg, setKg] = useState(1);
  return (
    <Card variant="outlined" sx={{ maxWidth: 600 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>Vektomregner</Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          <b> </b> Konverter mellom kilo, pund, unser og stein. Skriv inn vekt i kilo for å se resultatene i andre enheter.
        </Typography>
        <Stack spacing={2}>
          <TextField type="number" label="Kilogram" fullWidth value={kg} onChange={e => setKg(+e.target.value)} />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Typography>Pund: {kgToLb(kg).toFixed(2)}</Typography>
            <Typography>Unser: {kgToOz(kg).toFixed(2)}</Typography>
            <Typography>Stein: {kgToStone(kg).toFixed(2)}</Typography>
          </Box>
        </Stack>
        <Typography variant="caption" display="block" mt={2}>Omvendt: 1 pund = {lbToKg(1).toFixed(3)} kg, 1 unse = {ozToKg(1).toFixed(4)} kg</Typography>
        <Typography variant="caption" display="block">1 stein = {stoneToKg(1).toFixed(3)} kg</Typography>
      </CardContent>
    </Card>
  );
};
export default Weight;
