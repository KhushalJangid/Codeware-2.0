import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import { SiGnometerminal } from '@icons-pack/react-simple-icons'
import CodeIcon from '@mui/icons-material/Code'
import PersonIcon from '@mui/icons-material/Person'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import LogoutIcon from '@mui/icons-material/Logout'
import LoginIcon from '@mui/icons-material/Login'
import BadgeIcon from '@mui/icons-material/Badge'
import EmailIcon from '@mui/icons-material/Email'
import FullscreenIcon from '@mui/icons-material/Fullscreen'
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import CheckIcon from '@mui/icons-material/Check'
import type { CursorPos, FileType } from '../types'
import { accent, useAppTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'
import { useEffect } from 'react'

const LANGUAGE_LABELS: Record<FileType, string> = {
  python: 'Python',
  javascript: 'JavaScript',
  java: 'Java',
  go: 'Go',
  dart: 'Dart',
  c: 'C',
  cpp: 'C++',
}

const ENCODINGS = ['UTF-8', 'UTF-16 LE', 'ASCII', 'ISO-8859-1']
const TAB_SIZES = [2, 4, 8]
const EOL_OPTIONS = ['LF', 'CRLF'] as const

export function StatusBar(props: {
  cursorPos: CursorPos
  tabSize: number
  onTabSizeChange: (size: number) => void
  encoding: string
  onEncodingChange: (enc: string) => void
  eol: 'LF' | 'CRLF'
  onEolChange: (eol: 'LF' | 'CRLF') => void
  activeLanguage: FileType | null
  onLanguageChange: (lang: FileType) => void
  onToggleSidebar?: () => void
  onToggleConsole?: () => void
  sidebarOpen?: boolean
  consoleVisible?: boolean
}) {
  const {
    cursorPos,
    tabSize,
    onTabSizeChange,
    encoding,
    onEncodingChange,
    eol,
    onEolChange,
    activeLanguage,
    onLanguageChange,
    onToggleConsole,
  } = props

  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()
  const { mode, setMode } = useAppTheme()
  const isDark = mode === 'dark'

  // Menu anchor states
  const [profileAnchor, setProfileAnchor] = useState<HTMLElement | null>(null)
  const [themeAnchor, setThemeAnchor] = useState<HTMLElement | null>(null)
  const [tabSizeAnchor, setTabSizeAnchor] = useState<HTMLElement | null>(null)
  const [encodingAnchor, setEncodingAnchor] = useState<HTMLElement | null>(null)
  const [eolAnchor, setEolAnchor] = useState<HTMLElement | null>(null)
  const [langAnchor, setLangAnchor] = useState<HTMLElement | null>(null)

  // Dialog state
  const [profileDialogOpen, setProfileDialogOpen] = useState(false)

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(Boolean(document.fullscreenElement))

  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(Boolean(document.fullscreenElement))
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  async function toggleFullscreen() {
    if (document.fullscreenElement) {
      await document.exitFullscreen()
      setIsFullscreen(false)
      return
    }
    await document.documentElement.requestFullscreen()
    setIsFullscreen(true)
  }

  // Status Bar colors (VS Code signature style matching theme)
  const bg = isDark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.08)'
  const textColor = isDark ? accent.light : accent.dark
  const hoverBg = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)'

  return (
    <>
      <Box
        sx={{
          height: 24,
          minHeight: 24,
          maxHeight: 24,
          flexShrink: 0,
          backgroundColor: bg,
          color: textColor,
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 0.75,
          fontSize: '0.72rem',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace',
          userSelect: 'none',
          zIndex: 1200,
          boxShadow: isDark
            ? '0 -1px 3px rgba(0,0,0,0.3)'
            : '0 -1px 3px rgba(0,0,0,0.1)',
        }}
      >
        {/* Left items */}
        <Stack direction="row" spacing={0.25} alignItems="center" sx={{ height: '100%' }}>
          {/* Profile / Account Button */}
          <Tooltip title={isAuthenticated && user ? `Account: ${user.first_name} ${user.last_name}` : 'Accounts & Profile'}>
            <Box
              onClick={(e) => setProfileAnchor(e.currentTarget)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                px: 0.8,
                height: '100%',
                // backgroundColor: 'rgba(99, 102, 241, 0.22)',
                fontWeight: 600,
                fontSize: '0.7rem',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease',
                '&:hover': { backgroundColor: 'rgba(99, 102, 241, 0.35)' },
              }}
            >
              <PersonIcon sx={{ fontSize: 13 }} />
              <span>{isAuthenticated && user ? user.first_name : 'Account'}</span>
            </Box>
          </Tooltip>

          {/* Remote / Host indicator */}
          <Tooltip title="Codeware Cloud IDE — Connected">
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                px: 0.8,
                height: '100%',
                // backgroundColor: 'rgba(0, 0, 0, 0.18)',
                fontWeight: 600,
                fontSize: '0.7rem',
                cursor: 'pointer',
                '&:hover': { backgroundColor: hoverBg },
              }}
            >
              <CodeIcon sx={{ fontSize: 13 }} />
              <span>Codeware</span>
            </Box>
          </Tooltip>

          {/* Sidebar Toggle Button */}
          {/* {onToggleSidebar ? (
            <Tooltip title="Toggle Sidebar">
              <Box
                onClick={onToggleSidebar}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  px: 0.6,
                  height: '100%',
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: hoverBg },
                }}
              >
                <MenuIcon sx={{ fontSize: 13 }} />
              </Box>
            </Tooltip>
          ) : null} */}

          {/* Errors & Warnings */}
          <Tooltip title="Toggle Output Console (0 Errors, 0 Warnings)">
            <Box
              onClick={onToggleConsole}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                px: 0.8,
                height: '100%',
                cursor: 'pointer',
                // color: mutedTextColor,
                '&:hover': { backgroundColor: hoverBg, color: textColor },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.2 }}>
                <SiGnometerminal size={12} />
                <span>Terminal</span>
              </Box>
            </Box>
          </Tooltip>
        </Stack>

        {/* Right items */}
        <Stack direction="row" spacing={0.25} alignItems="center" sx={{ height: '100%' }}>
          {/* Cursor Position */}
          <Tooltip title="Cursor position (Line, Column)">
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                px: 0.8,
                height: '100%',
                cursor: 'pointer',
                fontFamily: 'monospace',
                fontSize: '0.72rem',
                color: textColor,
                '&:hover': { backgroundColor: hoverBg },
              }}
            >
              <span>
                Ln {cursorPos.line}, Col {cursorPos.column}
                {cursorPos.selectedCount > 0 ? ` (${cursorPos.selectedCount} selected)` : ''}
              </span>
            </Box>
          </Tooltip>

          {/* Tab Size / Indentation Menu */}
          <Tooltip title="Select Indentation / Tab Size">
            <Box
              onClick={(e) => setTabSizeAnchor(e.currentTarget)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                px: 0.8,
                height: '100%',
                cursor: 'pointer',
                // color: mutedTextColor,
                '&:hover': { backgroundColor: hoverBg, color: textColor },
              }}
            >
              <span>Spaces: {tabSize}</span>
            </Box>
          </Tooltip>

          {/* Encoding Menu */}
          <Tooltip title="Select File Encoding">
            <Box
              onClick={(e) => setEncodingAnchor(e.currentTarget)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                px: 0.8,
                height: '100%',
                cursor: 'pointer',
                // color: mutedTextColor,
                '&:hover': { backgroundColor: hoverBg, color: textColor },
              }}
            >
              <span>{encoding}</span>
            </Box>
          </Tooltip>

          {/* EOL Sequence Menu */}
          <Tooltip title="Select End of Line Sequence">
            <Box
              onClick={(e) => setEolAnchor(e.currentTarget)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                px: 0.8,
                height: '100%',
                cursor: 'pointer',
                // color: mutedTextColor,
                '&:hover': { backgroundColor: hoverBg, color: textColor },
              }}
            >
              <span>{eol}</span>
            </Box>
          </Tooltip>

          {/* Language Mode Menu */}
          <Tooltip title="File Language">
            <Box
              // onClick={(e) => activeLanguage && setLangAnchor(e.currentTarget)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                px: 0.8,
                height: '100%',
                cursor: activeLanguage ? 'pointer' : 'default',
                color: textColor,
                fontWeight: 600,
                '&:hover': activeLanguage ? { backgroundColor: hoverBg } : {},
              }}
            >
              <span>{activeLanguage ? LANGUAGE_LABELS[activeLanguage] : 'Plain Text'}</span>
            </Box>
          </Tooltip>

          {/* Theme Menu Button */}
          <Tooltip title="Select Color Theme">
            <Box
              onClick={(e) => setThemeAnchor(e.currentTarget)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.4,
                px: 0.8,
                height: '100%',
                cursor: 'pointer',
                '&:hover': { backgroundColor: hoverBg, color: textColor },
              }}
            >
              {mode === 'dark' ? (
                <DarkModeIcon sx={{ fontSize: 13 }} />
              ) : (
                <LightModeIcon sx={{ fontSize: 13 }} />
              )}
              <span>{mode === 'dark' ? 'Dark' : 'Light'}</span>
            </Box>
          </Tooltip>

          {/* Fullscreen Toggle Button */}
          <Tooltip title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}>
            <Box
              onClick={() => void toggleFullscreen()}
              sx={{
                display: 'flex',
                alignItems: 'center',
                px: 0.6,
                height: '100%',
                cursor: 'pointer',
                '&:hover': { backgroundColor: hoverBg },
              }}
            >
              {isFullscreen ? (
                <FullscreenExitIcon sx={{ fontSize: 13 }} />
              ) : (
                <FullscreenIcon sx={{ fontSize: 13 }} />
              )}
            </Box>
          </Tooltip>
        </Stack>
      </Box>

      {/* Theme Selection Menu */}
      <Menu
        anchorEl={themeAnchor}
        open={Boolean(themeAnchor)}
        onClose={() => setThemeAnchor(null)}
        slotProps={{
          paper: {
            sx: {
              minWidth: 160,
              borderRadius: 2,
            },
          },
        }}
      >
        <MenuItem
          selected={mode === 'dark'}
          onClick={() => {
            setMode('dark')
            setThemeAnchor(null)
          }}
          sx={{ fontSize: '0.8rem', py: 0.7, px: 2, display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <ListItemIcon sx={{ minWidth: '24px !important' }}>
            <DarkModeIcon sx={{ fontSize: 16 }} />
          </ListItemIcon>
          <ListItemText primary="Dark Theme" primaryTypographyProps={{ fontSize: '0.8rem' }} />
          {mode === 'dark' ? <CheckIcon sx={{ fontSize: 14, ml: 1 }} /> : null}
        </MenuItem>
        <MenuItem
          selected={mode === 'light'}
          onClick={() => {
            setMode('light')
            setThemeAnchor(null)
          }}
          sx={{ fontSize: '0.8rem', py: 0.7, px: 2, display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <ListItemIcon sx={{ minWidth: '24px !important' }}>
            <LightModeIcon sx={{ fontSize: 16 }} />
          </ListItemIcon>
          <ListItemText primary="Light Theme" primaryTypographyProps={{ fontSize: '0.8rem' }} />
          {mode === 'light' ? <CheckIcon sx={{ fontSize: 14, ml: 1 }} /> : null}
        </MenuItem>
      </Menu>


      {/* Profile Menu */}
      <Menu
        anchorEl={profileAnchor}
        open={Boolean(profileAnchor)}
        onClose={() => setProfileAnchor(null)}
        slotProps={{
          paper: {
            sx: {
              minWidth: 220,
              borderRadius: 2,
              mt: -0.5,
              boxShadow: isDark
                ? '0 8px 32px rgba(0, 0, 0, 0.45)'
                : '0 8px 24px rgba(0, 0, 0, 0.12)',
            },
          },
        }}
      >
        {isAuthenticated && user ? (
          [
            <Box key="header" sx={{ px: 2, py: 1.5 }}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar
                  sx={{
                    width: 34,
                    height: 34,
                    background: accent.gradient,
                    fontSize: '0.85rem',
                    fontWeight: 700,
                  }}
                >
                  {user.first_name[0]}
                  {user.last_name[0]}
                </Avatar>
                <Box sx={{ overflow: 'hidden' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.85rem', lineHeight: 1.2 }}>
                    {user.first_name} {user.last_name}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: isDark ? '#8b8b9a' : '#6b6b7b',
                      fontSize: '0.72rem',
                      display: 'block',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {user.email}
                  </Typography>
                </Box>
              </Stack>
            </Box>,
            <Divider key="div-1" sx={{ my: 0.5 }} />,
            <MenuItem
              key="profile"
              onClick={() => {
                setProfileAnchor(null)
                setProfileDialogOpen(true)
              }}
              sx={{ py: 1, fontSize: '0.82rem' }}
            >
              <ListItemIcon>
                <PersonOutlineIcon sx={{ fontSize: 18 }} />
              </ListItemIcon>
              <ListItemText primary="Profile" primaryTypographyProps={{ fontSize: '0.82rem' }} />
            </MenuItem>,
            <MenuItem
              key="logout"
              onClick={() => {
                setProfileAnchor(null)
                logout()
              }}
              sx={{ py: 1, fontSize: '0.82rem', color: '#ef4444' }}
            >
              <ListItemIcon sx={{ color: '#ef4444' }}>
                <LogoutIcon sx={{ fontSize: 18 }} />
              </ListItemIcon>
              <ListItemText primary="Log out" primaryTypographyProps={{ fontSize: '0.82rem', fontWeight: 500 }} />
            </MenuItem>,
          ]
        ) : (
          [
            <Box key="header-guest" sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                Guest Account
              </Typography>
              <Typography variant="caption" sx={{ color: isDark ? '#8b8b9a' : '#6b6b7b', fontSize: '0.72rem' }}>
                Sign in to sync files to the cloud
              </Typography>
            </Box>,
            <Divider key="div-guest" sx={{ my: 0.5 }} />,
            <MenuItem
              key="signin"
              onClick={() => {
                setProfileAnchor(null)
                navigate('/login')
              }}
              sx={{ py: 1, fontSize: '0.82rem' }}
            >
              <ListItemIcon>
                <LoginIcon sx={{ fontSize: 18 }} />
              </ListItemIcon>
              <ListItemText primary="Sign in" primaryTypographyProps={{ fontSize: '0.82rem', fontWeight: 600 }} />
            </MenuItem>,
          ]
        )}
      </Menu>

      {/* Tab Size Menu */}
      <Menu
        anchorEl={tabSizeAnchor}
        open={Boolean(tabSizeAnchor)}
        onClose={() => setTabSizeAnchor(null)}
      >
        {TAB_SIZES.map((size) => (
          <MenuItem
            key={size}
            selected={size === tabSize}
            onClick={() => {
              onTabSizeChange(size)
              setTabSizeAnchor(null)
            }}
            sx={{ fontSize: '0.8rem', py: 0.5, px: 2 }}
          >
            Indent Using Spaces: {size}
          </MenuItem>
        ))}
      </Menu>

      {/* Encoding Menu */}
      <Menu
        anchorEl={encodingAnchor}
        open={Boolean(encodingAnchor)}
        onClose={() => setEncodingAnchor(null)}
      >
        {ENCODINGS.map((enc) => (
          <MenuItem
            key={enc}
            selected={enc === encoding}
            onClick={() => {
              onEncodingChange(enc)
              setEncodingAnchor(null)
            }}
            sx={{ fontSize: '0.8rem', py: 0.5, px: 2 }}
          >
            {enc}
          </MenuItem>
        ))}
      </Menu>

      {/* EOL Sequence Menu */}
      <Menu
        anchorEl={eolAnchor}
        open={Boolean(eolAnchor)}
        onClose={() => setEolAnchor(null)}
      >
        {EOL_OPTIONS.map((opt) => (
          <MenuItem
            key={opt}
            selected={opt === eol}
            onClick={() => {
              onEolChange(opt)
              setEolAnchor(null)
            }}
            sx={{ fontSize: '0.8rem', py: 0.5, px: 2 }}
          >
            {opt}
          </MenuItem>
        ))}
      </Menu>

      {/* Language Mode Menu */}
      <Menu
        anchorEl={langAnchor}
        open={Boolean(langAnchor)}
        onClose={() => setLangAnchor(null)}
      >
        {(Object.keys(LANGUAGE_LABELS) as FileType[]).map((langKey) => (
          <MenuItem
            key={langKey}
            selected={langKey === activeLanguage}
            onClick={() => {
              onLanguageChange(langKey)
              setLangAnchor(null)
            }}
            sx={{ fontSize: '0.8rem', py: 0.5, px: 2 }}
          >
            {LANGUAGE_LABELS[langKey]}
          </MenuItem>
        ))}
      </Menu>

      {/* Profile Info Dialog */}
      <Dialog
        open={profileDialogOpen}
        onClose={() => setProfileDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 3, p: 1 } } }}
      >
        <DialogTitle sx={{ textAlign: 'center', pt: 3, pb: 1 }}>
          <Stack alignItems="center" spacing={1.5}>
            <Avatar
              sx={{
                width: 56,
                height: 56,
                background: accent.gradient,
                fontSize: '1.4rem',
                fontWeight: 700,
                boxShadow: `0 0 20px ${accent.main}44`,
              }}
            >
              {user ? `${user.first_name[0]}${user.last_name[0]}` : 'U'}
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
                {user ? `${user.first_name} ${user.last_name}` : 'User Profile'}
              </Typography>
              <Chip
                label="Active Cloud Account"
                size="small"
                color="primary"
                sx={{ height: 22, fontSize: '0.7rem', mt: 0.5 }}
              />
            </Box>
          </Stack>
        </DialogTitle>

        <DialogContent sx={{ px: 3, py: 2 }}>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <BadgeIcon sx={{ fontSize: 20, color: isDark ? accent.light : accent.dark }} />
                <Box>
                  <Typography variant="caption" sx={{ color: isDark ? '#8b8b9a' : '#6b6b7b', display: 'block' }}>
                    User ID
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    #{user?.id ?? 'N/A'}
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <EmailIcon sx={{ fontSize: 20, color: isDark ? accent.light : accent.dark }} />
                <Box>
                  <Typography variant="caption" sx={{ color: isDark ? '#8b8b9a' : '#6b6b7b', display: 'block' }}>
                    Email Address
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {user?.email ?? 'N/A'}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5, justifyContent: 'space-between' }}>
          <Button
            onClick={() => {
              setProfileDialogOpen(false)
              logout()
            }}
            color="error"
            startIcon={<LogoutIcon sx={{ fontSize: 16 }} />}
            sx={{ fontSize: '0.82rem' }}
          >
            Log out
          </Button>
          <Button
            onClick={() => setProfileDialogOpen(false)}
            variant="contained"
            sx={{ fontSize: '0.82rem', px: 2.5 }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
