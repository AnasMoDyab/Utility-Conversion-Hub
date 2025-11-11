import React, { useState } from 'react';
import { Paper, Typography, TextField, Button, Select, MenuItem, Box } from '@mui/material';

const jsonToCsv = (jsonStr: string) => {
  try {
    const arr = JSON.parse(jsonStr) as any[];
    if (!Array.isArray(arr)) return { error: 'JSON must be an array of objects' };
    const keys: string[] = Array.from(arr.reduce((s, o: any) => { Object.keys(o || {}).forEach((k: string) => s.add(k)); return s; }, new Set<string>()));
    const rows = [keys.join(',')];
    for (const o of arr) rows.push(keys.map(k => {
      const v = (o as any)[k];
      if (v === null || v === undefined) return '';
      const s = String(v).replace(/"/g, '""');
      return `"${s}"`;
    }).join(','));
    return { csv: rows.join('\n') };
  } catch (e:any) { return { error: e.message } }
};

const csvToJson = (csvStr: string) => {
  const lines = csvStr.split(/\r?\n/).filter(Boolean);
  if (lines.length < 1) return { error: 'Empty CSV' };
  const headers = lines[0].split(/,\s*/).map(h=>h.replace(/^"|"$/g, ''));
  const out: any[] = [];
  for (let i=1;i<lines.length;i++){
    const cols = lines[i].split(/,\s*/).map(c=>c.replace(/^"|"$/g, ''));
    const o:any = {};
    headers.forEach((h, idx)=> o[h] = cols[idx] ?? '');
    out.push(o);
  }
  return { json: JSON.stringify(out, null, 2) };
};

const JsonCsvPage: React.FC = () => {
  const [mode, setMode] = useState<'json2csv'|'csv2json'>('json2csv');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const convert = () => {
    if (mode === 'json2csv') {
      const r = jsonToCsv(input); if ((r as any).error) setOutput((r as any).error); else setOutput((r as any).csv);
    } else { const r = csvToJson(input); if ((r as any).error) setOutput((r as any).error); else setOutput((r as any).json); }
  };
  return (
    <Paper sx={{ p:2 }}>
      <Typography variant="h6">JSON ↔ CSV</Typography>
      <Box sx={{ mt:1, display:'flex', gap:1 }}>
        <Select value={mode} onChange={e=>setMode(e.target.value as any)}>
          <MenuItem value="json2csv">JSON → CSV</MenuItem>
          <MenuItem value="csv2json">CSV → JSON</MenuItem>
        </Select>
        <Button variant="contained" onClick={convert}>Convert</Button>
      </Box>
      <TextField multiline minRows={8} fullWidth sx={{ mt:1 }} value={input} onChange={e=>setInput(e.target.value)} placeholder='Input' />
      <TextField multiline minRows={8} fullWidth sx={{ mt:1 }} value={output} placeholder='Output' />
    </Paper>
  );
};
export default JsonCsvPage;
