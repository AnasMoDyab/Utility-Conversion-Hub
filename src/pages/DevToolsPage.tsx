import React from 'react';
import { Paper, Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const DevToolsPage: React.FC = () => {
  return (
    <Paper sx={{ p:3 }}>
      <Typography variant="h5">Dev & Utility Tools</Typography>
      <Typography variant="body2" sx={{ mb:2 }}>Choose a developer tool:</Typography>
      <Box sx={{ display:'grid', gap:1, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' } }}>
        <Button component={Link} to="/dev/json-csv" variant="outlined">JSON ↔ CSV</Button>
        <Button component={Link} to="/dev/regex" variant="outlined">Regex Tester</Button>
        <Button component={Link} to="/dev/uuid-jwt" variant="outlined">UUID / JWT</Button>
        <Button component={Link} to="/dev/diff" variant="outlined">Diff Checker</Button>
        <Button component={Link} to="/dev/gradient" variant="outlined">Gradient / Palette</Button>
        <Button component={Link} to="/dev/responsive" variant="outlined">Responsive / Units</Button>
        <Button component={Link} to="/dev/api" variant="outlined">API Tester / Perf</Button>
        <Button component={Link} to="/dev/cheats" variant="outlined">Git & Docker Cheats</Button>
        <Button component={Link} to="/dev/icons" variant="outlined">Icon Finder</Button>
      </Box>
    </Paper>
  );
};


export default DevToolsPage;
