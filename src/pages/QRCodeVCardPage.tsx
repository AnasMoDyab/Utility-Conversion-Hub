import React, { useState, useRef } from 'react';
import { Paper, Typography, TextField, Box, Button, Tooltip } from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';

function buildVCard(data:{ name:string; org:string; title:string; phone:string; email:string; url:string }): string {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${data.name}`,
    data.org? `ORG:${data.org}`: '',
    data.title? `TITLE:${data.title}`: '',
    data.phone? `TEL;TYPE=CELL:${data.phone}`: '',
    data.email? `EMAIL;TYPE=INTERNET:${data.email}`: '',
    data.url? `URL:${data.url}`: '',
    'END:VCARD'
  ].filter(Boolean);
  return lines.join('\n');
}

const QRCodeVCardPage: React.FC = () => {
  const [form, setForm] = useState({ name:'Jane Doe', org:'Acme Inc', title:'Engineer', phone:'+1 555 123 4567', email:'jane@example.com', url:'https://example.com' });
  const [mode, setMode] = useState<'text'|'vcard'>('vcard');
  const [text, setText] = useState('https://example.com');
  const svgRef = useRef<SVGSVGElement | null>(null);
  const vcard = buildVCard(form);
  const qrValue = mode==='vcard'? vcard : text;

  function handleChange<K extends keyof typeof form>(key:K, value:string){ setForm(f => ({ ...f, [key]: value })); }

  function downloadSVG(){
    if (!svgRef.current) return;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svgRef.current);
    const blob = new Blob([source], { type:'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'qr-code.svg'; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Paper sx={{ p:3 }}>
      <Typography variant="h5" gutterBottom>QR Code + vCard Generator</Typography>
      <Typography variant="body2" gutterBottom>Create a QR code for raw text/URL or generate a contact vCard.</Typography>

      <Box sx={{ display:'flex', gap:2, flexWrap:'wrap', mt:2 }}>
        <Button variant={mode==='vcard'?'contained':'outlined'} onClick={()=>setMode('vcard')}>vCard</Button>
        <Button variant={mode==='text'?'contained':'outlined'} onClick={()=>setMode('text')}>Text / URL</Button>
      </Box>

      {mode==='text' && (
        <TextField fullWidth label="Text / URL" sx={{ mt:2 }} value={text} onChange={e=>setText(e.target.value)} />
      )}

      {mode==='vcard' && (
        <Box sx={{ mt:1, display:'grid', gap:2, gridTemplateColumns:{ xs:'1fr', sm:'1fr 1fr' } }}>
          <TextField label="Full Name" fullWidth value={form.name} onChange={e=>handleChange('name', e.target.value)} />
          <TextField label="Organization" fullWidth value={form.org} onChange={e=>handleChange('org', e.target.value)} />
          <TextField label="Title" fullWidth value={form.title} onChange={e=>handleChange('title', e.target.value)} />
          <TextField label="Phone" fullWidth value={form.phone} onChange={e=>handleChange('phone', e.target.value)} />
          <TextField label="Email" fullWidth value={form.email} onChange={e=>handleChange('email', e.target.value)} />
          <TextField label="Website" fullWidth value={form.url} onChange={e=>handleChange('url', e.target.value)} />
          <Box sx={{ gridColumn:'1 / -1' }}>
            <Tooltip title="Preview of the generated vCard text.">
              <TextField multiline minRows={4} fullWidth label="vCard" value={vcard} InputProps={{ readOnly:true }} />
            </Tooltip>
          </Box>
        </Box>
      )}

      <Box sx={{ mt:3, textAlign:'center' }}>
        <QRCodeSVG value={qrValue} size={220} includeMargin ref={svgRef as any} />
        <Box sx={{ mt:2, display:'flex', gap:2, justifyContent:'center' }}>
          <Button variant="outlined" onClick={downloadSVG}>Download SVG</Button>
          <Button variant="outlined" onClick={()=>navigator.clipboard.writeText(qrValue)}>Copy Raw Text</Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default QRCodeVCardPage;
