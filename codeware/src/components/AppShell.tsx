import { type PropsWithChildren } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AppBar,
  Box,
  Button,
  Chip,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import LoginIcon from '@mui/icons-material/Login'
import { useAppTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'
import { accent } from '../contexts/ThemeContext'

export function AppShell({ children }: PropsWithChildren) {
  const navigate = useNavigate()
  const { mode } = useAppTheme()
  const { user, isAuthenticated, logout } = useAuth()
  const isDark = mode === 'dark'

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static" elevation={0}>
        <Toolbar variant="dense">
          {/* Brand */}
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mr: 3 }}>
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: '8px',
                background: accent.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 0 14px ${accent.main}55`,
                flexShrink: 0,
              }}
            >
              <Typography
                sx={{
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  color: '#fff',
                  letterSpacing: '-0.5px',
                  fontFamily: 'monospace',
                }}
              >
                {'</>'}
              </Typography>
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontSize: '0.95rem',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                background: isDark
                  ? 'linear-gradient(135deg, #e8e8ed 0%, #8b8b9a 100%)'
                  : 'linear-gradient(135deg, #111118 0%, #6b6b7b 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Codeware
            </Typography>
          </Stack>

          {/* Separator */}
          <Box
            sx={{
              width: 1,
              height: 20,
              mr: 2,
            }}
          />

          <Stack direction="row" spacing={0.5} alignItems="center">
            {isAuthenticated && user ? (
              <Chip
                label={`${user.first_name} ${user.last_name}`}
                size="small"
                sx={{
                  height: 26,
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  backgroundColor: isDark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.08)',
                  color: isDark ? accent.light : accent.dark,
                  border: `1px solid ${isDark ? 'rgba(99,102,241,0.25)' : 'rgba(99,102,241,0.2)'}`,
                  mr: 1,
                }}
              />
            ) : null}

            {isAuthenticated ? (
              <Tooltip title="Logout">
                <IconButton
                  size="small"
                  onClick={logout}
                  sx={{ color: isDark ? '#8b8b9a' : '#6b6b7b' }}
                >
                  <LogoutIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            ) : (
              <Button
                onClick={() => navigate('/login')}
                size="small"
                variant="contained"
                startIcon={<LoginIcon sx={{ fontSize: '14px !important' }} />}
                sx={{
                  ml: 0.5,
                  height: 30,
                  fontSize: '0.78rem',
                  px: 1.5,
                  whiteSpace: 'nowrap',
                }}
              >
                Sign in
              </Button>
            )}
          </Stack>
        </Toolbar>
      </AppBar>

      <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {children}
      </Box>
    </Box>
  )
}
