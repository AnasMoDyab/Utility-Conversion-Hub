import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Stack } from '@mui/material';
import { decToHex, decToBin, hexToDec, binToDec } from '../utils/extraConversions';

const HexBinaryPage: React.FC = () => {
  const [dec, setDec] = useState(255);
  const [hex, setHex] = useState('FF');
  const [bin, setBin] = useState('11111111');
  return (
    <Card variant="outlined" sx={{ maxWidth: 680 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>Hex/Bin-omregner</Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom><b> </b> Konverter mellom desimal, heksadesimal og binær for enkel utviklerbruk.</Typography>
        <Stack spacing={2}>
          <TextField type="number" label="Desimal" fullWidth value={dec} onChange={e => { const v = +e.target.value; setDec(v); setHex(decToHex(v)); setBin(decToBin(v)); }} />
          <TextField label="Hex" fullWidth value={hex} onChange={e => { const v = e.target.value.toUpperCase(); setHex(v); if (/^[0-9A-F]*$/.test(v) && v) { const d = hexToDec(v); setDec(d); setBin(decToBin(d)); } }} />
          <TextField label="Binær" fullWidth value={bin} onChange={e => { const v = e.target.value; setBin(v); if (/^[01]*$/.test(v) && v) { const d = binToDec(v); setDec(d); setHex(decToHex(d)); } }} />
          <Typography>Kontroll: Desimal {dec} → Hex {decToHex(dec)} → Bin {decToBin(dec)}</Typography>
        </Stack>
        <Typography variant="caption" mt={2}>Kun positive heltall støttes.</Typography>
      </CardContent>
    </Card>
  );
};
export default HexBinaryPage;
