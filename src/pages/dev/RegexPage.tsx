import React, { useState } from 'react';
import { Paper, Typography, TextField, Button, Box } from '@mui/material';

const RegexPage: React.FC = () => {
  const [pattern, setPattern] = useState('^\\w+$');
  const [flags, setFlags] = useState('g');
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  // TODO: add bank card, phone, etc.
  const presets = [
    { name:'Email', re:/^\S+@\S+\.\S+$/i, desc:'Basic email format' },
    { name:'IPv4', re:/\b(?:\d{1,3}\.){3}\d{1,3}\b/g, desc:'IPv4 address' },
    { name:'URL', re:/https?:\/\/[^\s]+/g, desc:'HTTP/HTTPS URL' },
    { name:'Hex Color', re:/#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/g, desc:'Hex color code' },
    { name:'UUID v4', re:/\b[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b/gi, desc:'UUID version 4' },
    { name:'ISO Date', re:/\b\d{4}-\d{2}-\d{2}\b/g, desc:'YYYY-MM-DD date' },
    { name:'US ZIP', re:/\b\d{5}(?:-\d{4})?\b/g, desc:'US postal code' }
  ];
  const applyPreset = (p:{name:string;re:RegExp;desc:string}) => { setPattern(p.re.source); setFlags(p.re.flags); };
  const run = () => {
    try { const re = new RegExp(pattern, flags); const matches = Array.from(input.matchAll(re)).map(m=>JSON.stringify(m)); setResult(matches.length ? matches.join('\n') : 'No match'); }
    catch (e:any) { setResult(e.message); }
  };
  return (
    <Paper sx={{ p:2 }}>
      <Typography variant="h6">Regex Tester</Typography>
      <TextField fullWidth label="Pattern" value={pattern} onChange={e=>setPattern(e.target.value)} sx={{ mt:1 }} />
      <TextField fullWidth label="Flags" value={flags} onChange={e=>setFlags(e.target.value)} sx={{ mt:1 }} />
      <TextField multiline minRows={6} fullWidth value={input} onChange={e=>setInput(e.target.value)} sx={{ mt:1 }} placeholder='Input text' />
      <Box sx={{ display:'flex', gap:1, mt:1 }}>
        <Button variant="contained" onClick={run}>Run</Button>
        <Button variant="outlined" onClick={()=>{ setInput(''); setResult(''); }}>Clear</Button>
      </Box>
      <Box sx={{ mt:2, display:'grid', gap:1, gridTemplateColumns:{ xs:'1fr', sm:'1fr 1fr 1fr' } }}>
        {presets.map(p=> (
          <Button key={p.name} variant="outlined" onClick={()=>applyPreset(p)} title={p.desc}>{p.name}</Button>
        ))}
      </Box>
      <Typography variant="caption" sx={{ mt:1, display:'block' }}>Select a preset to fill pattern & flags.</Typography>
      <TextField multiline minRows={6} fullWidth sx={{ mt:1 }} value={result} placeholder='Result' />
    </Paper>
  );
};
export default RegexPage;
