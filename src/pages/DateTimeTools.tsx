import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Stack } from '@mui/material';
import { ageFromDOB, convertTimezone } from '../utils/conversions';

const DateTimeTools: React.FC = () => {
  const [dob, setDob] = useState('2000-01-01');
  const [offset, setOffset] = useState(0); // minutes offset
  const age = ageFromDOB(new Date(dob));
  const converted = convertTimezone(new Date(), offset);
  return (
    <Card variant="outlined" sx={{ maxWidth: 600 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>Dato- og tidverktøy</Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          <b> </b> Kalkuler alder ut fra fødselsdato, og konverter tidssoner (manuell offset).
        </Typography>
        <Stack spacing={2}>
          <TextField type="date" label="Fødselsdato" fullWidth value={dob} onChange={e => setDob(e.target.value)} InputLabelProps={{ shrink: true }} />
          <Typography>Alder: {age} år</Typography>
          <TextField type="number" label="Mål-offset (minutter)" fullWidth value={offset} onChange={e => setOffset(+e.target.value)} />
          <Typography>Konvertert tid: {converted.toLocaleString()}</Typography>
          <Typography variant="caption">(Foreløpig tidssonekonvertering med manuell offset)</Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};
export default DateTimeTools;
