import { useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import { useAuth } from '../contexts/AuthContext'
import { useAppTheme } from '../contexts/ThemeContext'
import { accent } from '../contexts/ThemeContext'

export function LoginDialog(props: { open: boolean; onClose: () => void }) {
  const { open, onClose } = props
  const { login, register } = useAuth()
  const { mode } = useAppTheme()
  const isDark = mode === 'dark'

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const canSubmit = useMemo(() => {
    if (!email || !password) return false
    if (authMode === 'register') return Boolean(name && confirmPassword)
    return true
  }, [email, password, authMode, name, confirmPassword])

  async function onSubmit() {
    setError(null)
    setBusy(true)
    try {
      if (authMode === 'login') {
        await login(email, password)
      } else {
        await register({ name, email, password, confirmPassword })
      }
      onClose()
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setBusy(false)
    }
  }

  function switchMode(m: 'login' | 'register') {
    setAuthMode(m)
    setError(null)
  }

  return (
    <Dialog open={open} onClose={busy ? undefined : onClose} fullWidth maxWidth="xs">
      <DialogContent sx={{ p: 0, overflow: 'hidden' }}>
        {/* Header banner */}
        <Box
          sx={{
            background: accent.gradient,
            px: 3,
            pt: 3,
            pb: 3.5,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative circles */}
          <Box
            sx={{
              position: 'absolute',
              width: 120,
              height: 120,
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.08)',
              top: -40,
              right: -30,
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              width: 80,
              height: 80,
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.06)',
              bottom: -20,
              left: 20,
            }}
          />
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ position: 'relative' }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '10px',
                backgroundColor: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography sx={{ fontFamily: 'monospace', fontWeight: 700, color: '#fff', fontSize: '0.7rem' }}>
                {'</>'}
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#fff', letterSpacing: '-0.01em' }}>
                Codeware
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>
                Cloud Code Editor
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* Tab switcher */}
        <Box
          sx={{
            display: 'flex',
            backgroundColor: isDark ? '#1a1a20' : '#f4f4f6',
            mx: 3,
            mt: -1.5,
            borderRadius: 2,
            p: 0.5,
            position: 'relative',
            zIndex: 1,
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
          }}
        >
          {(['login', 'register'] as const).map((m) => (
            <Box
              key={m}
              onClick={() => switchMode(m)}
              sx={{
                flex: 1,
                py: 0.75,
                borderRadius: 1.5,
                cursor: 'pointer',
                textAlign: 'center',
                backgroundColor:
                  authMode === m
                    ? isDark
                      ? '#27272e'
                      : '#ffffff'
                    : 'transparent',
                boxShadow: authMode === m
                  ? isDark
                    ? '0 1px 4px rgba(0,0,0,0.3)'
                    : '0 1px 4px rgba(0,0,0,0.08)'
                  : 'none',
                transition: 'background 0.2s, box-shadow 0.2s',
              }}
            >
              <Typography
                sx={{
                  fontSize: '0.8125rem',
                  fontWeight: authMode === m ? 600 : 400,
                  color:
                    authMode === m
                      ? isDark
                        ? '#e8e8ed'
                        : '#111118'
                      : isDark
                        ? '#6b6b7b'
                        : '#9b9bab',
                  transition: 'color 0.2s',
                }}
              >
                {m === 'login' ? 'Sign in' : 'Create account'}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Form */}
        <Stack spacing={2} sx={{ px: 3, pt: 2.5, pb: 3 }}>
          {authMode === 'register' ? (
            <TextField
              label="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineIcon sx={{ fontSize: 18, color: isDark ? '#6b6b7b' : '#9b9bab' }} />
                  </InputAdornment>
                ),
              }}
            />
          ) : null}

          <TextField
            label="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            size="small"
            type="email"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlinedIcon sx={{ fontSize: 18, color: isDark ? '#6b6b7b' : '#9b9bab' }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            size="small"
            autoComplete={authMode === 'login' ? 'current-password' : 'new-password'}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon sx={{ fontSize: 18, color: isDark ? '#6b6b7b' : '#9b9bab' }} />
                </InputAdornment>
              ),
            }}
          />

          {authMode === 'register' ? (
            <TextField
              label="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              size="small"
              autoComplete="new-password"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon sx={{ fontSize: 18, color: isDark ? '#6b6b7b' : '#9b9bab' }} />
                  </InputAdornment>
                ),
              }}
            />
          ) : null}

          {error ? (
            <Alert severity="error" sx={{ borderRadius: 2, fontSize: '0.78rem', py: 0.5 }}>
              {error}
            </Alert>
          ) : null}

          <Button
            onClick={onSubmit}
            variant="contained"
            disabled={!canSubmit || busy}
            fullWidth
            size="large"
            sx={{
              mt: 0.5,
              py: 1.25,
              fontSize: '0.875rem',
              fontWeight: 600,
              borderRadius: 2,
            }}
          >
            {busy ? (
              <CircularProgress size={18} sx={{ color: 'rgba(255,255,255,0.7)' }} />
            ) : authMode === 'login' ? (
              'Sign in'
            ) : (
              'Create account'
            )}
          </Button>

          <Button
            onClick={onClose}
            disabled={busy}
            fullWidth
            size="small"
            sx={{
              color: isDark ? '#6b6b7b' : '#9b9bab',
              fontSize: '0.78rem',
              '&:hover': { backgroundColor: 'transparent', color: isDark ? '#e8e8ed' : '#111118' },
            }}
          >
            Cancel
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
