import React, { useState } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Box,
  IconButton,
  Divider,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { Link, useLocation } from 'react-router-dom'

const drawerWidth = 240

type NavItem = { label: string; path: string }
type NavCategory = { title: string; items: NavItem[] }

const categories: NavCategory[] = [
  { title: 'Home', items: [{ label: 'Dashboard', path: '/' }] },
  {
    title: 'Conversions',
    items: [
      { label: 'Currency', path: '/currency' },
      { label: 'Weight', path: '/weight' },
      { label: 'Length', path: '/length' },
      { label: 'Temperature', path: '/temperature' },
      { label: 'Volume', path: '/volume' },
      { label: 'Speed', path: '/speed' },
      { label: 'Data Storage', path: '/data-storage' },
      { label: 'Energy', path: '/energy' },
      { label: 'Fuel', path: '/fuel' },
      { label: 'Pressure', path: '/pressure' },
      { label: 'Color', path: '/color' },
  { label: 'Palette', path: '/color-palette' },
      { label: 'Hex/Bin', path: '/hex-binary' },
    ],
  },
  {
    title: 'Finance',
    items: [
      { label: 'Unit Price', path: '/unit-price' },
      { label: 'Loan', path: '/loan' },
      { label: 'Trend', path: '/currency-trend' },
      { label: 'Tax & Salary', path: '/tax-salary' },
      { label: 'Tip & Tax', path: '/tip-tax' },
      { label: 'Percentage', path: '/percentage' },
    ],
  },
  {
    title: 'Health & Cooking',
    items: [
      { label: 'BMI', path: '/bmi' },
      { label: 'Kalorier', path: '/calorie-burn' },
      { label: 'Cooking', path: '/cooking' },
    ],
  },
  {
    title: 'Math & Science',
    items: [
      { label: 'Math Tools', path: '/math' },
      { label: 'Scientific', path: '/scientific' },
      { label: 'Physics', path: '/physics' },
      { label: 'JSON', path: '/json-tools' },
    ],
  },
  {
    title: 'Text & Data',
    items: [
      { label: 'Base64', path: '/base64' },
      { label: 'Markdown', path: '/markdown' },
      { label: 'Tegn Teller', path: '/text-tools' },
      { label: 'Passord styrke', path: '/password-strength' },
      { label: 'Hash', path: '/hash-tools' },
      { label: 'Emoji', path: '/emoji-translator' },
      { label: 'Navn', path: '/name-gen' },
      { label: 'Joke/Quote', path: '/joke-quote' },
      { label: 'QR-kode', path: '/qr' },
      { label: 'QR vCard', path: '/qr-vcard' },
      { label: 'Regex', path: '/regex' },
    ],
  },
  {
    title: 'Random & Games',
    items: [
      { label: 'Tilfeldig', path: '/random-tools' },
      { label: 'Spill', path: '/games' },
      { label: 'Snake', path: '/snake' },
          { label: 'Minesweeper', path: '/minesweeper' },
          { label: 'Tenzies', path: '/tenzies' },
          { label: '15 Puzzle', path: '/puzzle-15' },
          { label: 'Register Trix', path: '/trix-register' },
    ],
  },
  { title: 'Dev', items: [{ label: 'Dev Tools', path: '/dev-tools' }] },
  { title: 'Other', items: [{ label: 'Date & Time', path: '/datetime' }] },
  { title: 'Planning', items: [ { label: 'Timezone Planner', path: '/timezone-planner' } ] },
]

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [mobileOpen, setMobileOpen] = useState(false)

  const toggleDrawer = () => setMobileOpen(o => !o)
  const closeDrawer = () => setMobileOpen(false)

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Tools
        </Typography>
        {isMobile && (
          <IconButton aria-label="close navigation" onClick={closeDrawer} size="small">
            <CloseIcon />
          </IconButton>
        )}
      </Toolbar>
      <Divider />
      <Box sx={{ flex: 1, overflowY: 'auto', py: 1 }}>
        <List dense={isMobile}>
          {categories.map((cat) => (
            <Box key={cat.title} sx={{ mb: 2 }}>
              <Typography
                variant="caption"
                sx={{
                  color: 'teal',
                  pl: 2,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}
              >
                {cat.title}
              </Typography>
              {cat.items.map((item) => (
                <ListItemButton
                  key={item.path}
                  component={Link}
                  to={item.path}
                  selected={location.pathname === item.path}
                  sx={{ py: 0.5 }}
                  onClick={() => { if (isMobile) closeDrawer() }}
                >
                  <ListItemText primary={item.label} />
                </ListItemButton>
              ))}
            </Box>
          ))}
        </List>
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
        <Toolbar sx={{ gap: 1 }}>
          {isMobile && (
            <IconButton color="inherit" edge="start" aria-label="menu" onClick={toggleDrawer}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Utility & Conversion Hub
          </Typography>
        </Toolbar>
      </AppBar>
      {/* Drawer for desktop */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      )}
      {/* Temporary drawer for mobile */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={closeDrawer}
          ModalProps={{ keepMounted: true }}
          sx={{ [`& .MuiDrawer-paper`]: { width: drawerWidth } }}
        >
          {drawerContent}
        </Drawer>
      )}
      <Box
        component="main"
        sx={{ flexGrow: 1, p: { xs: 1.5, sm: 2, md: 3 }, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  )
}

export default Layout
