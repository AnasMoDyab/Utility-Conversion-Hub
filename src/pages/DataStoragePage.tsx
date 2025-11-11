import React, { useState, useMemo } from 'react';
import { Card, CardContent, Typography, TextField, Stack, MenuItem, Box } from '@mui/material';
import { bytesToKB, bytesToMB, bytesToGB, bytesToTB, kbToBytes, mbToBytes, gbToBytes, tbToBytes } from '../utils/extraConversions';

const units = [
  { label: 'Bytes', value: 'B', toBytes: (v: number) => v, fromBytes: (b: number) => b },
  { label: 'KB', value: 'KB', toBytes: (v: number) => kbToBytes(v), fromBytes: (b: number) => bytesToKB(b) },
  { label: 'MB', value: 'MB', toBytes: (v: number) => mbToBytes(v), fromBytes: (b: number) => bytesToMB(b) },
  { label: 'GB', value: 'GB', toBytes: (v: number) => gbToBytes(v), fromBytes: (b: number) => bytesToGB(b) },
  { label: 'TB', value: 'TB', toBytes: (v: number) => tbToBytes(v), fromBytes: (b: number) => bytesToTB(b) },
];

const DataStoragePage: React.FC = () => {
  const [inputValue, setInputValue] = useState(1);
  const [fromUnit, setFromUnit] = useState('MB');
  const [toUnit, setToUnit] = useState('GB');

  const bytes = useMemo(() => {
    const u = units.find(u => u.value === fromUnit)!;
    return u.toBytes(inputValue);
  }, [inputValue, fromUnit]);

  const converted = useMemo(() => {
    const t = units.find(u => u.value === toUnit)!;
    return t.fromBytes(bytes);
  }, [bytes, toUnit]);

  return (
    <Card variant="outlined" sx={{ maxWidth: 700 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>Datastørrelseskonvertering</Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          <b> </b> Velg en kildeenhet (Bytes, KB, MB, GB, TB) og konverter til ønsket mål. Basert på 1024-faktor.
        </Typography>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField type="number" label="Verdi" value={inputValue} onChange={e => setInputValue(+e.target.value)} sx={{ minWidth: 140 }} />
            <TextField select label="Fra" value={fromUnit} onChange={e => setFromUnit(e.target.value)} sx={{ minWidth: 140 }}>
              {units.map(u => <MenuItem key={u.value} value={u.value}>{u.label}</MenuItem>)}
            </TextField>
            <TextField select label="Til" value={toUnit} onChange={e => setToUnit(e.target.value)} sx={{ minWidth: 140 }}>
              {units.map(u => <MenuItem key={u.value} value={u.value}>{u.label}</MenuItem>)}
            </TextField>
          </Box>
          <Typography variant="h6">Resultat: {converted.toLocaleString(undefined, { maximumFractionDigits: 12 })} {toUnit}</Typography>
          <Typography variant="subtitle2">Intermediært (bytes): {bytes.toLocaleString()}</Typography>
          <Box>
            <Typography variant="subtitle2" gutterBottom>Alle enheter fra input:</Typography>
            <Typography>Bytes: {bytes.toLocaleString()}</Typography>
            <Typography>KB: {bytesToKB(bytes).toLocaleString(undefined, { maximumFractionDigits: 6 })}</Typography>
            <Typography>MB: {bytesToMB(bytes).toLocaleString(undefined, { maximumFractionDigits: 6 })}</Typography>
            <Typography>GB: {bytesToGB(bytes).toLocaleString(undefined, { maximumFractionDigits: 8 })}</Typography>
            <Typography>TB: {bytesToTB(bytes).toLocaleString(undefined, { maximumFractionDigits: 10 })}</Typography>
          </Box>
        </Stack>
        <Typography mt={2} variant="caption">1 KB = {kbToBytes(1)} bytes | 1 MB = {mbToBytes(1)} bytes | 1 GB = {gbToBytes(1)} bytes | 1 TB = {tbToBytes(1)} bytes</Typography>
      </CardContent>
    </Card>
  );
};
export default DataStoragePage;
