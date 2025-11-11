import React, { useState } from 'react';
import { Typography, Paper, TextField, Box } from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';

const QRCodePage: React.FC = () => {
  const [text, setText] = useState('https://example.com');

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>QR Kode Generator</Typography>
      <Typography variant="body2" gutterBottom>Konverter tekst eller URL til en QR-kode.</Typography>
      <TextField fullWidth label="Tekst / URL" value={text} onChange={e => setText(e.target.value)} sx={{ mt: 2 }} />
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <QRCodeSVG value={text} size={220} />
      </Box>
    </Paper>
  );
};

export default QRCodePage;
