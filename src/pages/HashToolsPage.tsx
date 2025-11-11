import React, { useState } from 'react'
import { Typography, Paper, TextField, Button, Box } from '@mui/material'
import md5 from 'blueimp-md5'

async function sha256(text: string) {
  const data = new TextEncoder().encode(text)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}
async function sha1(text: string) {
  const data = new TextEncoder().encode(text)
  const hash = await crypto.subtle.digest('SHA-1', data)
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

const HashToolsPage: React.FC = () => {
  const [input, setInput] = useState('')
  const [md5Val, setMd5Val] = useState('')
  const [sha1Val, setSha1Val] = useState('')
  const [sha256Val, setSha256Val] = useState('')

  const run = async () => {
    setMd5Val(md5(input))
    setSha1Val(await sha1(input))
    setSha256Val(await sha256(input))
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Hash Generator
      </Typography>
      <Typography variant="body2">
        Generer MD5, SHA-1 og SHA-256 for en tekststreng.
      </Typography>
      <TextField
        fullWidth
        label="Tekst"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        sx={{ mt: 2 }}
      />
      <Button variant="contained" sx={{ mt: 2 }} onClick={run}>
        Hash
      </Button>
      <Box sx={{ mt: 2 }}>
        {md5Val && (
          <Typography variant="body2">
            <strong>MD5:</strong> {md5Val}
          </Typography>
        )}
        {sha1Val && (
          <Typography variant="body2">
            <strong>SHA-1:</strong> {sha1Val}
          </Typography>
        )}
        {sha256Val && (
          <Typography variant="body2">
            <strong>SHA-256:</strong> {sha256Val}
          </Typography>
        )}
      </Box>
    </Paper>
  )
}

export default HashToolsPage
