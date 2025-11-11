import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Stack } from '@mui/material';
import { lToMl, lToGallonUS, lToCupUS } from '../utils/conversions';

const VolumePage: React.FC = () => {
  const [liters, setLiters] = useState(1);
  return (
    <Card variant="outlined" sx={{ maxWidth: 600 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>Volumomregner</Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          <b>Om denne funksjonen:</b> Konverter mellom liter, milliliter, amerikanske gallon og kopper. Skriv inn volum i liter for å se resultatene i andre enheter.
        </Typography>
        <Stack spacing={2}>
          <TextField type="number" label="Liter" fullWidth value={liters} onChange={e => setLiters(+e.target.value)} />
          <Typography>Milliliter: {lToMl(liters).toFixed(2)}</Typography>
          <Typography>Gallon (US): {lToGallonUS(liters).toFixed(3)}</Typography>
          <Typography>Kopper (US): {lToCupUS(liters).toFixed(2)}</Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};
export default VolumePage;
