import React, { useState } from 'react';
import { Paper, Typography, TextField, Button, Box, Chip, Tooltip, Switch, FormControlLabel } from '@mui/material';

interface Preset { name:string; re:RegExp; desc:string }
const presets: Preset[] = [
  { name:'Email', re:/^\S+@\S+\.\S+$/i, desc:'Basic email format' },
  { name:'IPv4', re:/\b(?:\d{1,3}\.){3}\d{1,3}\b/g, desc:'IPv4 address' },
  { name:'URL', re:/https?:\/\/[^\s]+/g, desc:'HTTP/HTTPS URL' },
  { name:'Hex Color', re:/#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/g, desc:'Hex color code' },
  { name:'UUID v4', re:/\b[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b/gi, desc:'UUID v4' },
  { name:'ISO Date', re:/\b\d{4}-\d{2}-\d{2}\b/g, desc:'YYYY-MM-DD' },
  { name:'US ZIP', re:/\b\d{5}(?:-\d{4})?\b/g, desc:'US postal code' },
];

const cheatsheet: { title:string; items:string[] }[] = [
  { title:'Basics', items:['^ start','$ end','\\n newline','\\t tab','\\\\ escape'] },
  { title:'Character Classes', items:['\\d digit','\\w word','\\s space','\\D non-digit','[A-Z] range'] },
  { title:'Quantifiers', items:['* 0+','+ 1+','? 0/1','{n}','{n,m}'] },
  { title:'Groups', items:['(abc)','(a|b)','(?: ) non-capture','(?<name> ) named'] },
  { title:'Assertions', items:['(?= ) lookahead','(?! ) negative lookahead','\\b word boundary'] }
];

const RegexTesterPage: React.FC = () => {
  const [pattern, setPattern] = useState('^\\w+$');
  const [flags, setFlags] = useState('g');
  const [input, setInput] = useState('Try email test@example.com or color #336699 and a uuid 123e4567-e89b-12d3-a456-426614174000');
  const [matches, setMatches] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const [highlight, setHighlight] = useState(true);

  function applyPreset(p:Preset){ setPattern(p.re.source); setFlags(p.re.flags); run(p.re); }

  function run(existing?:RegExp){
    setError('');
    try {
      const re = existing || new RegExp(pattern, flags);
      const found = Array.from(input.matchAll(re));
      setMatches(found.map(m => m[0]));
    } catch (e:any){ setError(e.message); setMatches([]); }
  }

  function highlightedText(){
    if (!highlight || matches.length===0) return input;
    // naive highlight by splitting; might break for overlapping matches
    let result: React.ReactNode[] = []; let lastIndex = 0;
    try {
      const re = new RegExp(pattern, flags.includes('g')? flags: flags+'g');
      const all = Array.from(input.matchAll(re));
      for (const m of all) {
        const start = m.index || 0; const end = start + m[0].length;
        if (start > lastIndex) result.push(input.slice(lastIndex,start));
        result.push(<span key={start} style={{ background:'gold', color:'#000' }}>{m[0]}</span>);
        lastIndex = end;
      }
      result.push(input.slice(lastIndex));
      return result;
    } catch { return input; }
  }

  return (
    <Paper sx={{ p:3 }}>
      <Typography variant="h5" gutterBottom>Regex Tester & Cheatsheet</Typography>
      <Typography variant="body2" gutterBottom>Test JavaScript regular expressions. Select presets or enter your own pattern & flags.</Typography>
      <Box sx={{ display:'flex', gap:2, flexWrap:'wrap', mt:2 }}>
        <TextField label="Pattern" value={pattern} onChange={e=>setPattern(e.target.value)} sx={{ flexGrow:1, minWidth:220 }} />
        <TextField label="Flags" value={flags} onChange={e=>setFlags(e.target.value)} sx={{ width:120 }} />
        <Button variant="contained" onClick={()=>run()}>Run</Button>
        <FormControlLabel control={<Switch checked={highlight} onChange={e=>setHighlight(e.target.checked)} />} label="Highlight" />
      </Box>
      <TextField multiline minRows={5} fullWidth sx={{ mt:2 }} label="Input" value={input} onChange={e=>setInput(e.target.value)} />
      <Box sx={{ mt:2, display:'flex', gap:1, flexWrap:'wrap' }}>
        {presets.map(p => (
          <Tooltip title={p.desc} key={p.name}><Chip clickable label={p.name} onClick={()=>applyPreset(p)} /></Tooltip>
        ))}
      </Box>
      <Box sx={{ mt:2 }}>
        <Typography variant="subtitle2">Matches ({matches.length})</Typography>
        <Paper variant="outlined" sx={{ p:1, minHeight:60, fontFamily:'monospace', whiteSpace:'pre-wrap' }}>
          {error && <Typography color="error" variant="caption">{error}</Typography>}
          {!error && matches.length===0 && <Typography variant="caption">No matches</Typography>}
          {!error && matches.length>0 && matches.map((m,i)=>(<Typography key={i} variant="caption" display="block">{m}</Typography>))}
        </Paper>
      </Box>
      <Box sx={{ mt:3 }}>
        <Typography variant="subtitle2" gutterBottom>Cheatsheet</Typography>
        <Box sx={{ display:'grid', gap:2, gridTemplateColumns:{ xs:'1fr', sm:'repeat(auto-fill, minmax(160px,1fr))' } }}>
          {cheatsheet.map(section => (
            <Paper key={section.title} sx={{ p:1 }}>
              <Typography variant="caption" sx={{ fontWeight:600 }}>{section.title}</Typography>
              {section.items.map(item => <Typography variant="caption" key={item} display="block">{item}</Typography>)}
            </Paper>
          ))}
        </Box>
      </Box>
      <Box sx={{ mt:3 }}>
        <Typography variant="subtitle2">Highlighted Input</Typography>
        <Paper variant="outlined" sx={{ p:1, fontFamily:'monospace', whiteSpace:'pre-wrap' }}>{highlightedText()}</Paper>
      </Box>
    </Paper>
  );
};

export default RegexTesterPage;
