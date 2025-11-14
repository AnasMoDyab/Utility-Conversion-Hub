import React from 'react'
import { Container } from '@mui/material'

const GlobalContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Container maxWidth="lg" disableGutters sx={{ px: { xs: 2, sm: 3 }, pb: 6 }}>
    {children}
  </Container>
)

export default GlobalContainer
