import React from 'react'
import { Box, Typography, Paper, Button, Stack } from '@mui/material'
import GlobalContainer from '../components/GlobalContainer'
import { useTheme } from '@mui/material/styles'
import { categories } from '../components/Layout'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip as ChartTooltip } from 'chart.js'
import { Line } from 'react-chartjs-2'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ChartTooltip)

const StatCard: React.FC<{ label: string; value: string | number; color?: string; bg?: string }> = ({ label, value, color = '#3f51b5', bg = 'rgba(63,81,181,0.06)' }) => (
  <Paper sx={{ p: 2, height: '100%' }} elevation={1}>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="h5" sx={{ mt: 1 }}>
      {value}
    </Typography>
    <Box sx={{ mt: 1 }}>
      <Line
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { x: { display: false }, y: { display: false } },
        }}
        data={{ labels: Array.from({ length: 8 }, (_, i) => i.toString()), datasets: [{ data: Array.from({ length: 8 }, () => Math.floor(Math.random() * 100)), borderColor: color, backgroundColor: bg, tension: 0.3 }], }}
        height={60}
      />
    </Box>
  </Paper>
)

const Dashboard: React.FC = () => {
  const theme = useTheme()
  const [history, setHistory] = useState<{ ts: number; time: number }[]>([])
  const [loading, setLoading] = useState(false)

  // Derive metrics from categories where possible
  const toolCount = categories.reduce((sum, c) => sum + c.items.length, 0)
  // Approx pages = categories count (simple proxy)
  const pageCount = categories.length
  const activeUsers = Number(localStorage.getItem('demoActiveUsers') || 8)
  const avgResponse = Math.floor(Math.random() * 60) + 10

  const stats = [
    { label: 'Tools', value: toolCount },
    { label: 'Categories', value: pageCount },
    { label: 'Active Users (demo)', value: activeUsers },
    { label: 'Avg. Response (ms)', value: avgResponse },
  ]

  useEffect(() => {
    let mounted = true
    setLoading(true)
    axios.get('/metrics')
      .then(r => {
        if (!mounted) return
        const d = r.data
        setHistory(d.history || [])
        // persist simple active users
        if (d.activeUsers) localStorage.setItem('demoActiveUsers', String(d.activeUsers))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
    return () => { mounted = false }
  }, [])

  const quick = [
    { to: '/currency', label: 'Currency' },
    { to: '/length', label: 'Length' },
    { to: '/temperature', label: 'Temperature' },
    { to: '/math', label: 'Math Tools' },
  ]

  return (
    <GlobalContainer>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4">Dashboard</Typography>
        <Typography variant="body2" color="text.secondary">Quick overview and shortcuts to frequently used tools.</Typography>
      </Box>

      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2,1fr)', md: 'repeat(4,1fr)' } }}>
        {stats.map((s, i) => (
          <Box key={s.label}>
            <StatCard label={s.label} value={s.value} color={theme.palette.primary.main} bg={theme.palette.primary.main + '18'} />
          </Box>
        ))}
      </Box>

      <Box sx={{ mt: 3 }}>
        <Typography variant="h6">Quick Links</Typography>
        <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
          {quick.map(q => (
            <Button key={q.to} component={Link} to={q.to} variant="outlined" size="small">
              {q.label}
            </Button>
          ))}
        </Stack>
      </Box>

      <Box sx={{ mt: 3 }}>
        <Typography variant="h6">Recent Activity</Typography>
        <Paper sx={{ p: 2, mt: 1 }}>
          {loading ? 'Loading history...' : (
            <Box>
              <Typography variant="caption">Response time history</Typography>
              <Box sx={{ height: 120 }}>
                <Line
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: { x: { display: false }, y: { display: true } },
                  }}
                  data={{
                    labels: history.map(h => new Date(h.ts).toLocaleTimeString()),
                    datasets: [{ data: history.map(h => h.time), borderColor: theme.palette.primary.main, backgroundColor: theme.palette.primary.main + '18', tension: 0.3 }],
                  }}
                />
              </Box>
            </Box>
          )}
        </Paper>
      </Box>
    </GlobalContainer>
  )
}

export default Dashboard
