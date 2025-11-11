import React, { useState } from 'react';
import { Paper, Typography, TextField, Button, Box } from '@mui/material';

const lineDiff = (a:string,b:string) => {
  const A = a.split(/\r?\n/);
  const B = b.split(/\r?\n/);
  const max = Math.max(A.length, B.length);
  const rows: any[] = [];
  for (let i=0;i<max;i++) rows.push({ line: i+1, left: A[i] ?? '', right: B[i] ?? '' });
  return rows;
};

const highlightParts = (left:string, right:string) => {
  if (left === right) return { leftParts:[{text:left}], rightParts:[{text:right}] };
  const min = Math.min(left.length, right.length);
  let idx = 0;
  while (idx < min && left[idx] === right[idx]) idx++;
  // find common tail
  let tailLeft = left.length - 1;
  let tailRight = right.length - 1;
  while (tailLeft >= idx && tailRight >= idx && left[tailLeft] === right[tailRight]) { tailLeft--; tailRight--; }
  const leftParts = [] as {text:string; diff?:boolean}[];
  const rightParts = [] as {text:string; diff?:boolean}[];
  leftParts.push({ text: left.slice(0, idx) });
  leftParts.push({ text: left.slice(idx, tailLeft+1), diff:true });
  leftParts.push({ text: left.slice(tailLeft+1) });
  rightParts.push({ text: right.slice(0, idx) });
  rightParts.push({ text: right.slice(idx, tailRight+1), diff:true });
  rightParts.push({ text: right.slice(tailRight+1) });
  return { leftParts, rightParts };
};

const DiffPage: React.FC = () => {
  const [left, setLeft] = useState('');
  const [right, setRight] = useState('');
  const [rows, setRows] = useState<any[]>([]);
  return (
    <Paper sx={{ p:2 }}>
      <Typography variant="h6">Diff Checker</Typography>
      <TextField multiline minRows={6} fullWidth value={left} onChange={e=>setLeft(e.target.value)} placeholder='Left' />
      <TextField multiline minRows={6} fullWidth sx={{ mt:1 }} value={right} onChange={e=>setRight(e.target.value)} placeholder='Right' />
      <Box sx={{ display:'flex', gap:1, mt:1 }}>
        <Button variant="contained" onClick={()=>setRows(lineDiff(left, right))}>Run</Button>
        <Button variant="outlined" onClick={()=>{ setLeft(''); setRight(''); setRows([]); }}>Clear</Button>
      </Box>
      <Box sx={{ mt:1 }}>
        {rows.map(r=> {
          const { leftParts, rightParts } = highlightParts(r.left, r.right);
          const same = r.left === r.right;
          return (
            <Box key={r.line} sx={{ display:'flex', gap:1, p:0.5, background: same ? '#f6fff6' : '#fff6f6' }}>
              <Box sx={{ width:40 }}>{r.line}</Box>
              <Box sx={{ flex:1, fontFamily:'monospace' }}>
                {leftParts.map((p,i)=>(<span key={i} style={p.diff?{ background:'#ffd4d4', padding:'0 2px'}:{}}>{p.text}</span>))}
              </Box>
              <Box sx={{ flex:1, fontFamily:'monospace' }}>
                {rightParts.map((p,i)=>(<span key={i} style={p.diff?{ background:'#c8e6ff', padding:'0 2px'}:{}}>{p.text}</span>))}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
};
export default DiffPage;
