import React, { useState } from 'react'
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Select,
  MenuItem,
  Divider,
} from '@mui/material'

const ApiPerfPage: React.FC = () => {
  const [url, setUrl] = useState('')
  const [method, setMethod] = useState<'GET' | 'POST'>('GET')
  const [body, setBody] = useState('')
  const [resp, setResp] = useState('')
  const [headersJson, setHeadersJson] = useState('{"Accept":"application/json"}')
  const [metrics, setMetrics] = useState<{ms?:number,size?:number,status?:number,ok?:boolean} | null>(null)
  const [assets, setAssets] = useState('app.js:120000,logo.png:45000')
  const run = async () => {
    setResp('...')
    setMetrics(null)
    try {
      const start = performance.now()
      const opts: any = { method }
      // headers
      if (headersJson.trim()) {
        try { opts.headers = JSON.parse(headersJson) } catch { /* ignore parse error */ }
      }
      if (method === 'POST' && body) {
        opts.body = body
        if (!opts.headers) opts.headers = { 'Content-Type': 'application/json' }
        else if (!opts.headers['Content-Type']) opts.headers['Content-Type'] = 'application/json'
      }
      const r = await fetch(url, opts)
      const end = performance.now()
      const text = await r.text()
      let pretty = text
      // attempt JSON pretty
      try { pretty = JSON.stringify(JSON.parse(text), null, 2) } catch {}
      const size = text.length
      setResp(pretty)
      setMetrics({ ms: +(end-start).toFixed(2), size, status: r.status, ok: r.ok })
    } catch (e: any) {
      setResp(e.message)
    }
  }
  const estimate = () => {
    const parts = assets
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean)
    let total = 0
    for (const p of parts) {
      const m = p.match(/:(\d+)$/)
      if (m) total += Number(m[1])
    }
    const seconds = total / 125000
    alert(
      `Total: ${total} bytes\nEstimated load: ${seconds.toFixed(1)}s @1Mbps`
    )
  }
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6">API Request Tester & Performance</Typography>
      <TextField fullWidth label="URL" value={url} onChange={(e) => setUrl(e.target.value)} />
      <Select
        value={method}
        onChange={(e) => setMethod(e.target.value as any)}
        sx={{ mt: 1 }}
      >
        <MenuItem value={'GET'}>GET</MenuItem>
        <MenuItem value={'POST'}>POST</MenuItem>
      </Select>
      <TextField
        multiline
        minRows={2}
        fullWidth
        sx={{ mt: 1 }}
        label="Headers (JSON)"
        value={headersJson}
        onChange={(e)=>setHeadersJson(e.target.value)}
        placeholder='{"Accept":"application/json"}'
      />
      <TextField
        multiline
        minRows={4}
        fullWidth
        sx={{ mt: 1 }}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Body (for POST)"
      />
      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
        <Button variant="contained" onClick={run}>
          Send
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            setUrl('')
            setBody('')
            setResp('')
          }}
        >
          Clear
        </Button>
      </Box>
      {metrics && (
        <Box sx={{ mt:1, fontFamily:'monospace', fontSize:13, color:'#555' }}>
          Status: {metrics.status} ({metrics.ok ? 'OK':'ERROR'}) • Time: {metrics.ms} ms • Size: {metrics.size} bytes
        </Box>
      )}
      <TextField multiline minRows={6} fullWidth sx={{ mt: 1 }} value={resp} placeholder="Response" />
      <Divider sx={{ my: 2 }} />
      <TextField
        fullWidth
        label="Assets (name:size,... bytes)"
        value={assets}
        onChange={(e) => setAssets(e.target.value)}
      />
      <Button variant="contained" sx={{ mt: 1 }} onClick={estimate}>
        Estimate
      </Button>
    </Paper>
  )
}
export default ApiPerfPage
