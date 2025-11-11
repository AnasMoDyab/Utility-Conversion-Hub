import React, { useState } from 'react';
import { Typography, Paper, TextField, Box } from '@mui/material';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

const sample = `# Overskrift\n\nSkriv *markdown* her!\n\n- Punkt 1\n- Punkt 2`;

const MarkdownPage: React.FC = () => {
  const [md, setMd] = useState(sample);

  const html = DOMPurify.sanitize(marked.parse(md) as string);

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Markdown til HTML</Typography>
      <Typography variant="body2" gutterBottom>Konverter markdown tekst til sikker HTML.</Typography>
      <TextField fullWidth multiline minRows={8} label="Markdown" value={md} onChange={e => setMd(e.target.value)} sx={{ mt: 2 }} />
      <Box sx={{ mt: 3, border: '1px solid #ddd', p: 2, borderRadius: 1 }}>
        <Typography variant="subtitle1">Forhåndsvisning</Typography>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </Box>
    </Paper>
  );
};

export default MarkdownPage;
