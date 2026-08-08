import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useAuth } from '../contexts/AuthContext'
import { useAppTheme } from '../contexts/ThemeContext'
import { accent } from '../contexts/ThemeContext'

export function LoginPage() {
  const navigate = useNavigate()
  const { login, register, isAuthenticated } = useAuth()
  const { mode } = useAppTheme()
  const isDark = mode === 'dark'

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  // Redirect if already logged in
  if (isAuthenticated) {
    void navigate('/', { replace: true })
    return null
  }

  const canSubmit = useMemo(() => {
    if (!email || !password) return false
    if (authMode === 'register') return Boolean(name && confirmPassword)
    return true
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      navigate('/', { replace: true })
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

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !busy) void onSubmit()
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        backgroundColor: isDark ? '#0d0d0f' : '#f4f4f6',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative background blobs */}
      <Box
        sx={{
          position: 'absolute',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${accent.main}22 0%, transparent 70%)`,
          top: -150,
          left: -100,
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: `radial-gradient(circle, #8b5cf622 0%, transparent 70%)`,
          bottom: -100,
          right: -80,
          pointerEvents: 'none',
        }}
      />

      {/* Left panel — branding (hidden on small screens) */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          px: 8,
          py: 6,
          position: 'relative',
        }}
      >
        {/* Back to editor link */}
        <Button
          startIcon={<ArrowBackIcon sx={{ fontSize: 16 }} />}
          onClick={() => navigate('/')}
          sx={{
            position: 'absolute',
            top: 32,
            left: 32,
            color: isDark ? '#8b8b9a' : '#6b6b7b',
            fontSize: '0.8rem',
            '&:hover': { color: isDark ? '#e8e8ed' : '#111118', backgroundColor: 'transparent' },
          }}
        >
          Back to editor
        </Button>

        {/* Brand mark */}
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 6 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '14px',
              background: accent.gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 30px ${accent.main}55`,
            }}
          >
            <Typography
              sx={{
                fontSize: '1rem',
                fontWeight: 700,
                color: '#fff',
                fontFamily: 'monospace',
                letterSpacing: '-1px',
              }}
            >
              {'</>'}
            </Typography>
          </Box>
          <Typography
            sx={{
              fontSize: '1.6rem',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              background: isDark
                ? 'linear-gradient(135deg, #e8e8ed 0%, #8b8b9a 100%)'
                : 'linear-gradient(135deg, #111118 0%, #4b4b5a 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Codeware
          </Typography>
        </Stack>

        {/* Headline */}
        <Typography
          sx={{
            fontSize: '2.8rem',
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            color: isDark ? '#e8e8ed' : '#111118',
            mb: 2.5,
            maxWidth: 480,
          }}
        >
          Your cloud{' '}
          <Box
            component="span"
            sx={{
              background: accent.gradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            code editor
          </Box>
          ,<br />anywhere.
        </Typography>

        <Typography
          sx={{
            fontSize: '1rem',
            color: isDark ? '#8b8b9a' : '#6b6b7b',
            maxWidth: 400,
            lineHeight: 1.7,
            mb: 5,
          }}
        >
          Write, run, and save code in Python, Java, Go, C++, and more — all from your browser.
          Sign in to sync your files across any device.
        </Typography>

        {/* Feature pills */}
        <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
          {['Python', 'Java', 'Go', 'C / C++', 'Dart', 'JavaScript'].map((lang) => (
            <Box
              key={lang}
              sx={{
                px: 1.5,
                py: 0.6,
                borderRadius: 20,
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
              }}
            >
              <Typography sx={{ fontSize: '0.78rem', fontWeight: 500, color: isDark ? '#8b8b9a' : '#6b6b7b' }}>
                {lang}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>

      {/* Right panel — form */}
      <Box
        sx={{
          width: { xs: '100%', md: 460 },
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          px: { xs: 3, sm: 5 },
          py: 6,
          backgroundColor: isDark ? 'rgba(20,20,22,0.9)' : 'rgba(255,255,255,0.9)',
          borderLeft: { md: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` },
          backdropFilter: 'blur(20px)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Mobile back link */}
        <Button
          startIcon={<ArrowBackIcon sx={{ fontSize: 14 }} />}
          onClick={() => navigate('/')}
          size="small"
          sx={{
            display: { xs: 'flex', md: 'none' },
            alignSelf: 'flex-start',
            mb: 3,
            color: isDark ? '#8b8b9a' : '#6b6b7b',
            fontSize: '0.78rem',
            '&:hover': { backgroundColor: 'transparent', color: isDark ? '#e8e8ed' : '#111118' },
          }}
        >
          Back to editor
        </Button>

        {/* Mobile brand */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.5}
          sx={{ mb: 4, display: { xs: 'flex', md: 'none' } }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '10px',
              background: accent.gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#fff', fontFamily: 'monospace' }}>
              {'</>'}
            </Typography>
          </Box>
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, letterSpacing: '-0.02em', color: isDark ? '#e8e8ed' : '#111118' }}>
            Codeware
          </Typography>
        </Stack>

        {/* Form card */}
        <Box sx={{ width: '100%', maxWidth: 360 }}>
          <Typography
            sx={{
              fontSize: '1.5rem',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: isDark ? '#e8e8ed' : '#111118',
              mb: 0.75,
            }}
          >
            {authMode === 'login' ? 'Welcome back' : 'Create account'}
          </Typography>
          <Typography sx={{ fontSize: '0.85rem', color: isDark ? '#8b8b9a' : '#6b6b7b', mb: 3.5 }}>
            {authMode === 'login'
              ? 'Sign in to access your saved files.'
              : 'Join Codeware and start coding in the cloud.'}
          </Typography>

          {/* Tab switcher */}
          <Box
            sx={{
              display: 'flex',
              backgroundColor: isDark ? '#1a1a20' : '#f0f0f4',
              borderRadius: 2,
              p: 0.5,
              mb: 3,
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
            }}
          >
            {(['login', 'register'] as const).map((m) => (
              <Box
                key={m}
                onClick={() => switchMode(m)}
                sx={{
                  flex: 1,
                  py: 0.8,
                  borderRadius: 1.5,
                  cursor: 'pointer',
                  textAlign: 'center',
                  backgroundColor:
                    authMode === m
                      ? isDark ? '#27272e' : '#ffffff'
                      : 'transparent',
                  boxShadow:
                    authMode === m
                      ? isDark ? '0 1px 4px rgba(0,0,0,0.3)' : '0 1px 4px rgba(0,0,0,0.08)'
                      : 'none',
                  transition: 'all 0.2s',
                }}
              >
                <Typography
                  sx={{
                    fontSize: '0.8125rem',
                    fontWeight: authMode === m ? 600 : 400,
                    color:
                      authMode === m
                        ? isDark ? '#e8e8ed' : '#111118'
                        : isDark ? '#6b6b7b' : '#9b9bab',
                    transition: 'color 0.2s',
                    userSelect: 'none',
                  }}
                >
                  {m === 'login' ? 'Sign in' : 'Register'}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Fields */}
          <Stack spacing={2} onKeyDown={handleKeyDown}>
            {authMode === 'register' && (
              <TextField
                label="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                size="small"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlineIcon sx={{ fontSize: 18, color: isDark ? '#6b6b7b' : '#9b9bab' }} />
                    </InputAdornment>
                  ),
                }}
              />
            )}

            <TextField
              label="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              type="email"
              size="small"
              fullWidth
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
              fullWidth
              autoComplete={authMode === 'login' ? 'current-password' : 'new-password'}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon sx={{ fontSize: 18, color: isDark ? '#6b6b7b' : '#9b9bab' }} />
                  </InputAdornment>
                ),
              }}
            />

            {authMode === 'register' && (
              <TextField
                label="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type="password"
                size="small"
                fullWidth
                autoComplete="new-password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon sx={{ fontSize: 18, color: isDark ? '#6b6b7b' : '#9b9bab' }} />
                    </InputAdornment>
                  ),
                }}
              />
            )}

            {error && (
              <Alert severity="error" sx={{ borderRadius: 2, fontSize: '0.78rem', py: 0.5 }}>
                {error}
              </Alert>
            )}

            <Button
              onClick={() => void onSubmit()}
              variant="contained"
              disabled={!canSubmit || busy}
              fullWidth
              size="large"
              sx={{
                mt: 0.5,
                py: 1.4,
                fontSize: '0.9rem',
                fontWeight: 600,
                borderRadius: 2,
              }}
            >
              {busy ? (
                <CircularProgress size={20} sx={{ color: 'rgba(255,255,255,0.7)' }} />
              ) : authMode === 'login' ? (
                'Sign in'
              ) : (
                'Create account'
              )}
            </Button>
          </Stack>

          {/* Footer note */}
          <Typography
            sx={{ fontSize: '0.75rem', color: isDark ? '#4a4a58' : '#b0b0c0', textAlign: 'center', mt: 3 }}
          >
            {authMode === 'login' ? (
              <>Don't have an account?{' '}
                <Box
                  component="span"
                  onClick={() => switchMode('register')}
                  sx={{ color: accent.main, cursor: 'pointer', fontWeight: 500, '&:hover': { textDecoration: 'underline' } }}
                >
                  Register
                </Box>
              </>
            ) : (
              <>Already have an account?{' '}
                <Box
                  component="span"
                  onClick={() => switchMode('login')}
                  sx={{ color: accent.main, cursor: 'pointer', fontWeight: 500, '&:hover': { textDecoration: 'underline' } }}
                >
                  Sign in
                </Box>
              </>
            )}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
