const express = require('express')
const app = express()
const port = process.env.PORT || 4000

// Simple in-memory metrics store
let responseHistory = []

function recordResponse(time) {
  const ts = Date.now()
  responseHistory.push({ ts, time })
  if (responseHistory.length > 100) responseHistory.shift()
}

// Seed with some values
for (let i = 0; i < 12; i++) recordResponse(Math.floor(Math.random() * 80) + 10)

app.get('/metrics', (req, res) => {
  // Return summary and history
  const avg = Math.round(responseHistory.reduce((s, r) => s + r.time, 0) / responseHistory.length)
  res.json({ activeUsers: Math.floor(Math.random() * 20) + 3, avgResponse: avg, history: responseHistory })
})

// Simple endpoint to push a response time (can be used by demo hooks)
app.post('/metrics/record/:ms', (req, res) => {
  const ms = parseInt(req.params.ms, 10)
  if (!isNaN(ms)) recordResponse(ms)
  res.json({ ok: true })
})

app.listen(port, () => console.log(`Metrics API listening on ${port}`))
