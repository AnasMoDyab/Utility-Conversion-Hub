import React, { useState } from 'react';
import { Paper, Typography, TextField, Button, Box } from '@mui/material';

const uuidv4 = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
  const r = Math.floor(Math.random()*16);
  const v = c === 'x' ? r : ((r & 0x3) | 0x8);
  return v.toString(16);
});

const decodeJwt = (token: string) => {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return { error: 'Invalid JWT' };
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    return { payload };
  } catch (e:any) { return { error: e.message } }
};

const UuidJwtPage: React.FC = () => {
  const [uuid, setUuid] = useState('');
  const [jwt, setJwt] = useState('');
  const [payload, setPayload] = useState<any>(null);
  return (
    <Paper sx={{ p:2 }}>
      <Typography variant="h6">UUID & JWT</Typography>
      <Box sx={{ display:'flex', gap:1, mt:1 }}>
        <Button variant="contained" onClick={()=>setUuid(uuidv4())}>Generate UUID</Button>
        <TextField value={uuid} sx={{ flex:1 }} />
      </Box>
      <TextField multiline minRows={4} fullWidth sx={{ mt:2 }} value={jwt} onChange={e=>setJwt(e.target.value)} placeholder='Paste JWT' />
      <Box sx={{ display:'flex', gap:1, mt:1 }}>
        <Button variant="contained" onClick={()=>{ const r = decodeJwt(jwt); setPayload((r as any).payload ?? { error:(r as any).error }); }}>Decode</Button>
        <Button variant="outlined" onClick={()=>{ setJwt(''); setPayload(null); }}>Clear</Button>
      </Box>
      <TextField multiline minRows={6} fullWidth sx={{ mt:1 }} value={payload ? JSON.stringify(payload, null, 2) : ''} placeholder='Payload' />
    </Paper>
  );
};
export default UuidJwtPage;
