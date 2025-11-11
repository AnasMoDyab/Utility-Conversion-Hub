import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Stack } from '@mui/material';
import { mToFt, mToIn, mToMiles, mToKm } from '../utils/conversions';

const LengthPage: React.FC = () => {
  const [meters, setMeters] = useState(1);
  return (
    <Card variant="outlined" sx={{ maxWidth: 600 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>Lengde- og avstandskonvertering</Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          <b> </b> Konverter mellom meter, kilometer, fot, tommer og mil. Skriv inn lengde i meter for å se resultatene i andre enheter.
        </Typography>
        <Stack spacing={2}>
          <TextField type="number" label="Meter" fullWidth value={meters} onChange={e => setMeters(+e.target.value)} />
          <Typography>Kilometer: {mToKm(meters).toFixed(4)}</Typography>
          <Typography>Fot: {mToFt(meters).toFixed(4)}</Typography>
          <Typography>Tommer: {mToIn(meters).toFixed(2)}</Typography>
          <Typography>Mil: {mToMiles(meters).toFixed(6)}</Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};
export default LengthPage;
