import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Stack } from '@mui/material';
import { bmi } from '../utils/conversions';

const BMIPage: React.FC = () => {
  const [weight, setWeight] = useState(70); // kg
  const [height, setHeight] = useState(175); // cm
  const res = bmi(weight, height);
  return (
    <Card variant="outlined" sx={{ maxWidth: 600 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>BMI-kalkulator</Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          <b> </b> Beregn din BMI (kroppsmasseindeks) basert på høyde og vekt.
        </Typography>
        <Stack spacing={2}>
          <TextField type="number" label="Vekt (kg)" fullWidth value={weight} onChange={e => setWeight(+e.target.value)} />
          <TextField type="number" label="Høyde (cm)" fullWidth value={height} onChange={e => setHeight(+e.target.value)} />
          <Typography>BMI: {res.value} ({res.category})</Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};
export default BMIPage;
