import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Stack } from '@mui/material';
import { kmhToMph, kmhToMs } from '../utils/conversions';

const SpeedPage: React.FC = () => {
  const [kmh, setKmh] = useState(60);
  return (
    <Card variant="outlined" sx={{ maxWidth: 600 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>Fartskonvertering</Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          <b>Om denne funksjonen:</b> Konverter mellom km/t, mph og m/s. Skriv inn fart i km/t for å se resultatene i andre enheter.
        </Typography>
        <Stack spacing={2}>
          <TextField type="number" label="km/t" fullWidth value={kmh} onChange={e => setKmh(+e.target.value)} />
          <Typography>mph: {kmhToMph(kmh).toFixed(2)}</Typography>
          <Typography>m/s: {kmhToMs(kmh).toFixed(2)}</Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};
export default SpeedPage;
