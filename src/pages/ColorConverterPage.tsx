import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, TextField, Stack, Box } from '@mui/material';
import { hexToRgb, rgbToHex, rgbToHsl, hslToRgb } from '../utils/extraConversions';

const ColorConverterPage: React.FC = () => {
  const [hex, setHex] = useState('#FF8800');
  const [r, setR] = useState(255);
  const [g, setG] = useState(136);
  const [b, setB] = useState(0);

  useEffect(() => {
    const rgb = hexToRgb(hex);
    if (rgb) { setR(rgb.r); setG(rgb.g); setB(rgb.b); }
  }, [hex]);

  const hsl = rgbToHsl(r, g, b);
  const rgbFromHsl = hslToRgb(hsl.h, hsl.s, hsl.l);

  return (
    <Card variant="outlined" sx={{ maxWidth: 760 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>Fargekonvertering</Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom><b>Om denne funksjonen:</b> Konverter mellom HEX, RGB og HSL.</Typography>
        <Stack spacing={2}>
          <TextField label="HEX" fullWidth value={hex} onChange={e => setHex(e.target.value)} />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField type="number" label="R" value={r} onChange={e => setR(+e.target.value)} />
            <TextField type="number" label="G" value={g} onChange={e => setG(+e.target.value)} />
            <TextField type="number" label="B" value={b} onChange={e => setB(+e.target.value)} />
          </Box>
          <Typography>HEX fra RGB: {rgbToHex(r,g,b)}</Typography>
          <Typography>HSL: h={hsl.h}°, s={hsl.s}%, l={hsl.l}%</Typography>
          <Typography>RGB fra HSL: {rgbFromHsl.r}, {rgbFromHsl.g}, {rgbFromHsl.b}</Typography>
          <Box sx={{ width: '100%', height: 60, borderRadius: 2, border: '1px solid #ccc', background: rgbToHex(r,g,b) }} />
        </Stack>
        <Typography variant="caption" mt={2}>Verdier antas gyldige. HEX-format #RRGGBB.</Typography>
      </CardContent>
    </Card>
  );
};
export default ColorConverterPage;
