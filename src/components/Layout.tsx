import React from 'react';
import { AppBar, Toolbar, Typography, Drawer, List, ListItemButton, ListItemText, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

const drawerWidth = 240;

const routes = [
  { label: 'Home', path: '/' },
  { label: 'Currency', path: '/currency' },
  { label: 'Weight', path: '/weight' },
  { label: 'Length', path: '/length' },
  { label: 'Temperature', path: '/temperature' },
  { label: 'Volume', path: '/volume' },
  { label: 'Speed', path: '/speed' },
  { label: 'Date & Time', path: '/datetime' },
  { label: 'Unit Price', path: '/unit-price' },
  { label: 'BMI', path: '/bmi' },
  { label: 'Tip & Tax', path: '/tip-tax' },
  { label: 'Percentage', path: '/percentage' },
  { label: 'Math Tools', path: '/math' },
  { label: 'Data Storage', path: '/data-storage' },
  { label: 'Energy', path: '/energy' },
  { label: 'Fuel', path: '/fuel' },
  { label: 'Pressure', path: '/pressure' },
  { label: 'Loan', path: '/loan' },
  { label: 'Trend', path: '/currency-trend' },
  { label: 'Tax & Salary', path: '/tax-salary' },
  { label: 'Cooking', path: '/cooking' },
  { label: 'Scientific', path: '/scientific' },
  { label: 'Physics', path: '/physics' },
  { label: 'Hex/Bin', path: '/hex-binary' },
  { label: 'Color', path: '/color' },
];

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Utility & Conversion Hub
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" sx={{ width: drawerWidth, [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' } }}>
        <Toolbar />
        <List>
          {routes.map(r => (
            <ListItemButton key={r.path} component={Link} to={r.path} selected={location.pathname === r.path}>
              <ListItemText primary={r.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
