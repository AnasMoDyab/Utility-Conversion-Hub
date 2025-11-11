import React, { useState } from 'react';
import { Paper, Typography, TextField, Box, Button, Select, MenuItem } from '@mui/material';

const GradientPage: React.FC = () => {
  const [a, setA] = useState('#ff7e5f');
  const [b, setB] = useState('#feb47b');
  const [dir, setDir] = useState('to right');
  const directions = [
    'to right','to left','to bottom','to top','to bottom right','to bottom left','to top right','to top left',
    '45deg','90deg','135deg','180deg','225deg','270deg','315deg','radial-gradient(circle at center, VARA, VARB)'
  ];
  const css = `linear-gradient(${dir}, ${a}, ${b})`;
  return (
    <Paper sx={{ p:2 }}>
      <Typography variant="h6">CSS Gradient Generator</Typography>
      <Box sx={{ display:'flex', gap:1, mt:1, flexWrap:'wrap' }}>
        <TextField value={a} onChange={e=>setA(e.target.value)} label="Color A" />
        <TextField value={b} onChange={e=>setB(e.target.value)} label="Color B" />
        <Select value={dir} onChange={e=>setDir(e.target.value)} sx={{ minWidth:160 }}>
          {directions.map(d=> (
            <MenuItem key={d} value={d.startsWith('radial')?d:'to '+d.replace('to ','')}>{d}</MenuItem>
          ))}
        </Select>
        <TextField value={dir} onChange={e=>setDir(e.target.value)} label="Custom" sx={{ flex:1, minWidth:200 }} />
      </Box>
      <Box sx={{ height: '100px', mt:1, p:2, borderRadius:1, border:'1px solid #ddd', background: css }}>
        <Typography sx={{ color:'#fff' }}>Preview</Typography>
      </Box>
      <TextField fullWidth sx={{ mt:1 }} value={`background: ${css};`} />
      <Button variant="outlined" sx={{ mt:1 }} onClick={()=>navigator.clipboard?.writeText(`background: ${css};`)}>Copy CSS</Button>
    </Paper>
  );
};
export default GradientPage;
