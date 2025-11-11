import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Stack } from '@mui/material';
import { bytesToKB, bytesToMB, bytesToGB, bytesToTB, kbToBytes, mbToBytes, gbToBytes, tbToBytes } from '../utils/extraConversions';

const DataStoragePage: React.FC = () => {
  const [bytes, setBytes] = useState(1024);
  return (
    <Card variant="outlined" sx={{ maxWidth: 620 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>Datastørrelseskonvertering</Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom><b>Om denne funksjonen:</b> Konverter mellom Bytes, KB, MB, GB og TB (1024-basert).</Typography>
        <Stack spacing={2}>
          <TextField type="number" label="Bytes" fullWidth value={bytes} onChange={e => setBytes(+e.target.value)} />
          <Typography>KB: {bytesToKB(bytes).toFixed(4)}</Typography>
          <Typography>MB: {bytesToMB(bytes).toFixed(6)}</Typography>
          <Typography>GB: {bytesToGB(bytes).toFixed(8)}</Typography>
          <Typography>TB: {bytesToTB(bytes).toFixed(10)}</Typography>
        </Stack>
        <Typography mt={2} variant="caption">Omvendt: 1 KB = {kbToBytes(1)} bytes | 1 MB = {mbToBytes(1)} bytes | 1 GB = {gbToBytes(1)} bytes | 1 TB = {tbToBytes(1)} bytes</Typography>
      </CardContent>
    </Card>
  );
};
export default DataStoragePage;
