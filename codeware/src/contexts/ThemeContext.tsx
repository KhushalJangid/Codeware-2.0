import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'
import { CssBaseline } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'

type ThemeMode = 'light' | 'dark'

type ThemeCtx = {
  mode: ThemeMode
  toggle: () => void
  setMode: (m: ThemeMode) => void
}

const ThemeContext = createContext<ThemeCtx | null>(null)

const THEME_KEY = 'cw_theme_mode'

// Accent color tokens
export const accent = {
  main: '#6366f1',
  light: '#818cf8',
  dark: '#4f46e5',
  gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
}

export function AppThemeProvider({ children }: PropsWithChildren) {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    const raw = localStorage.getItem(THEME_KEY)
    return raw === 'light' || raw === 'dark' ? raw : 'dark'
  })

  const setMode = useCallback((m: ThemeMode) => {
    setModeState(m)
    localStorage.setItem(THEME_KEY, m)
  }, [])

  const toggle = useCallback(() => {
    setMode(mode === 'dark' ? 'light' : 'dark')
  }, [mode, setMode])

  const theme = useMemo(() => {
    const isDark = mode === 'dark'
    return createTheme({
      palette: {
        mode,
        primary: {
          main: accent.main,
          light: accent.light,
          dark: accent.dark,
        },
        ...(isDark
          ? {
              background: {
                default: '#0d0d0f',
                paper: '#141416',
              },
              divider: 'rgba(255,255,255,0.07)',
              text: {
                primary: '#e8e8ed',
                secondary: '#8b8b9a',
              },
            }
          : {
              background: {
                default: '#f4f4f6',
                paper: '#ffffff',
              },
              divider: 'rgba(0,0,0,0.07)',
              text: {
                primary: '#111118',
                secondary: '#6b6b7b',
              },
            }),
      },
      shape: {
        borderRadius: 8,
      },
      typography: {
        fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        button: { textTransform: 'none', fontWeight: 500 },
        h6: { fontWeight: 600, letterSpacing: '-0.01em' },
        subtitle2: { fontWeight: 600, letterSpacing: '0.02em', fontSize: '0.7rem', textTransform: 'uppercase' },
        body2: { fontSize: '0.8125rem' },
      },
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            body: {
              fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
            },
          },
        },
        MuiAppBar: {
          styleOverrides: {
            root: {
              backgroundImage: 'none',
              backgroundColor: isDark ? '#0d0d0f' : '#ffffff',
              borderBottom: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.07)',
              boxShadow: 'none',
            },
          },
        },
        MuiToolbar: {
          styleOverrides: {
            dense: {
              minHeight: 48,
              paddingLeft: 16,
              paddingRight: 16,
            },
          },
        },
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: 7,
              fontWeight: 500,
              fontSize: '0.8125rem',
            },
            contained: {
              background: accent.gradient,
              boxShadow: 'none',
              '&:hover': {
                boxShadow: `0 0 20px ${accent.main}55`,
                background: accent.gradient,
              },
            },
          },
        },
        MuiIconButton: {
          styleOverrides: {
            root: {
              borderRadius: 7,
              transition: 'background 0.15s, transform 0.15s, color 0.15s',
              '&:hover': {
                transform: 'scale(1.08)',
                backgroundColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)',
              },
            },
          },
        },
        MuiTab: {
          styleOverrides: {
            root: {
              fontSize: '0.8125rem',
              fontWeight: 500,
              minHeight: 40,
              padding: '6px 12px',
              textTransform: 'none',
              color: isDark ? '#8b8b9a' : '#6b6b7b',
              '&.Mui-selected': {
                color: isDark ? '#e8e8ed' : '#111118',
              },
            },
          },
        },
        MuiTabs: {
          styleOverrides: {
            indicator: {
              background: accent.gradient,
              height: 2,
              borderRadius: '2px 2px 0 0',
            },
          },
        },
        MuiTextField: {
          styleOverrides: {
            root: {
              '& .MuiOutlinedInput-root': {
                borderRadius: 7,
                fontSize: '0.8125rem',
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: accent.main,
                  boxShadow: `0 0 0 3px ${accent.main}22`,
                },
              },
            },
          },
        },
        MuiDialog: {
          styleOverrides: {
            paper: {
              backgroundImage: 'none',
              backgroundColor: isDark ? '#18181c' : '#ffffff',
              border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
              borderRadius: 14,
              boxShadow: isDark
                ? '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(99,102,241,0.15)'
                : '0 32px 80px rgba(0,0,0,0.18)',
            },
          },
        },
        MuiListItemButton: {
          styleOverrides: {
            root: {
              borderRadius: 6,
              margin: '1px 6px',
              padding: '5px 8px',
              transition: 'background 0.12s',
              '&.Mui-selected': {
                backgroundColor: isDark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.08)',
              },
            },
          },
        },
        MuiDivider: {
          styleOverrides: {
            root: {
              borderColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)',
            },
          },
        },
        MuiTooltip: {
          styleOverrides: {
            tooltip: {
              fontSize: '0.72rem',
              borderRadius: 6,
              backgroundColor: isDark ? '#2a2a30' : '#1a1a22',
              color: '#e8e8ed',
              padding: '4px 9px',
            },
          },
        },
      },
    })
  }, [mode])

  const value = useMemo(() => ({ mode, toggle, setMode }), [mode, toggle, setMode])

  return (
    <ThemeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  )
}

export function useAppTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useAppTheme must be used within AppThemeProvider')
  return ctx
}
