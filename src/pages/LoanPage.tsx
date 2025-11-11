import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Stack } from '@mui/material';
import { loanMonthlyPayment } from '../utils/extraConversions';

const LoanPage: React.FC = () => {
  const [principal, setPrincipal] = useState(250000);
  const [rate, setRate] = useState(4.5);
  const [years, setYears] = useState(25);
  const breakdown = loanMonthlyPayment(principal, rate, years);
  return (
    <Card variant="outlined" sx={{ maxWidth: 760 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>Lån & Boliglån</Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom><b> </b> Beregn månedlig terminbeløp og total rente over løpetiden.</Typography>
        <Stack spacing={2}>
          <TextField type="number" label="Beløp (kr)" fullWidth value={principal} onChange={e => setPrincipal(+e.target.value)} />
          <TextField type="number" label="Årlig rente (%)" fullWidth value={rate} onChange={e => setRate(+e.target.value)} />
          <TextField type="number" label="År" fullWidth value={years} onChange={e => setYears(+e.target.value)} />
          <Typography>Månedlig: {breakdown.monthly} | Total rente: {breakdown.totalInterest} | Totalt betalt: {breakdown.totalPaid}</Typography>
        </Stack>
        <Typography variant="caption" mt={2}>Standard annuitetsformel brukt. Planlegger visning av amortiseringstabell senere.</Typography>
      </CardContent>
    </Card>
  );
};
export default LoanPage;
