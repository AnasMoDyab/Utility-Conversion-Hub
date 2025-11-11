import React, { useState } from 'react';
import { Typography, Paper, TextField, LinearProgress } from '@mui/material';
// @ts-ignore - zxcvbn type may not be available if types fail to install immediately
import zxcvbn from 'zxcvbn';

const PasswordStrengthPage: React.FC = () => {
  const [pwd, setPwd] = useState('');
  const result = pwd ? zxcvbn(pwd) : null;
  const score = result ? result.score : 0; // 0-4
  const percent = (score / 4) * 100;

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Passordstyrke</Typography>
      <Typography variant="body2" gutterBottom>Evaluer styrken på et passord med heuristisk analyse.</Typography>
      <TextField fullWidth label="Passord" type="password" value={pwd} onChange={e => setPwd(e.target.value)} sx={{ mt: 2 }} />
      <LinearProgress variant="determinate" value={percent} sx={{ mt: 2 }} />
      {result && <Typography sx={{ mt: 1 }}>Score: {score} / 4 • Estimert log10 gjetninger: {Math.round(result.guesses_log10)} </Typography>}
      {result && result.feedback.warning && <Typography color="warning.main">{result.feedback.warning}</Typography>}
      {result && result.feedback.suggestions.length > 0 && (
        <ul>
          {result.feedback.suggestions.map((s: string, i: number) => <li key={i}>{s}</li>)}
        </ul>
      )}
    </Paper>
  );
};

export default PasswordStrengthPage;
