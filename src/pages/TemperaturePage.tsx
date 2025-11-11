import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Stack } from '@mui/material';
import { cToF, cToK, fToC, kToC } from '../utils/conversions';

const TemperaturePage: React.FC = () => {
  const [celsius, setCelsius] = useState(0);
  return (
    <Card variant="outlined" sx={{ maxWidth: 600 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>Temperaturomregner</Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          <b> </b> Konverter mellom Celsius, Fahrenheit og Kelvin. Skriv inn temperatur i Celsius for å se resultatene i andre enheter.
        </Typography>
        <Stack spacing={2}>
          <TextField type="number" label="Celsius" fullWidth value={celsius} onChange={e => setCelsius(+e.target.value)} />
          <Typography>Fahrenheit: {cToF(celsius).toFixed(2)}</Typography>
          <Typography>Kelvin: {cToK(celsius).toFixed(2)}</Typography>
        </Stack>
        <Typography variant="caption" display="block" mt={2}>0 F = {fToC(0).toFixed(2)} C | 0 K = {kToC(0).toFixed(2)} C</Typography>
      </CardContent>
    </Card>
  );
};
export default TemperaturePage;
