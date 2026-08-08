import {
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItemButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline'
import DownloadIcon from '@mui/icons-material/Download'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import FolderOpenIcon from '@mui/icons-material/FolderOpen'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import type { CodeFile } from '../types'
import { useAppTheme } from '../contexts/ThemeContext'
import { accent } from '../contexts/ThemeContext'
import { useNavigate } from 'react-router-dom'

/** Returns a color and short label based on file extension */
function fileLanguageStyle(name: string): { color: string; bg: string; label: string } {
  const ext = name.split('.').pop()?.toLowerCase() ?? ''
  const map: Record<string, { color: string; bg: string; label: string }> = {
    py: { color: '#60a5fa', bg: 'rgba(96,165,250,0.12)', label: 'PY' },
    js: { color: '#fbbf24', bg: 'rgba(251,191,36,0.12)', label: 'JS' },
    ts: { color: '#38bdf8', bg: 'rgba(56,189,248,0.12)', label: 'TS' },
    tsx: { color: '#38bdf8', bg: 'rgba(56,189,248,0.12)', label: 'TSX' },
    jsx: { color: '#fbbf24', bg: 'rgba(251,191,36,0.12)', label: 'JSX' },
    java: { color: '#fb923c', bg: 'rgba(251,146,60,0.12)', label: 'JV' },
    c: { color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', label: 'C' },
    cpp: { color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', label: 'C++' },
    cs: { color: '#4ade80', bg: 'rgba(74,222,128,0.12)', label: 'C#' },
    go: { color: '#34d399', bg: 'rgba(52,211,153,0.12)', label: 'GO' },
    rs: { color: '#fb923c', bg: 'rgba(251,146,60,0.12)', label: 'RS' },
    html: { color: '#f87171', bg: 'rgba(248,113,113,0.12)', label: 'HTML' },
    css: { color: '#818cf8', bg: 'rgba(129,140,248,0.12)', label: 'CSS' },
  }
  return map[ext] ?? { color: '#8b8b9a', bg: 'rgba(139,139,154,0.1)', label: ext.toUpperCase().slice(0, 3) || 'TXT' }
}

export function Sidebar(props: {
  open: boolean
  onClose: () => void
  files: CodeFile[]
  loading: boolean
  isAuthenticated: boolean
  onRefresh: () => void
  onOpenFile: (file: CodeFile) => void
  onCreateServerFile: () => void
  onRenameFile: (file: CodeFile) => void
  onDeleteFile: (file: CodeFile) => void
  onDownloadFile: (file: CodeFile) => void
}) {
  const {
    open,
    onClose,
    files,
    loading,
    isAuthenticated,
    onRefresh,
    onOpenFile,
    onCreateServerFile,
    onRenameFile,
    onDeleteFile,
    onDownloadFile,
  } = props

  const { mode } = useAppTheme()
  const isDark = mode === 'dark'
  const navigate = useNavigate()

  return (
    <Box
      sx={(t) => ({
        width: '100%',
        overflow: 'hidden',
        borderRight: open ? `1px solid ${t.palette.divider}` : 'none',
        height: '100%',
        backgroundColor: isDark ? '#0f0f12' : '#f9f9fb',
        flex: '0 0 auto',
        display: 'flex',
        flexDirection: 'column',
      })}
    >
      {/* Header */}
      <Box sx={{ px: 1.5, py: 1.25 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={0.5} alignItems="center">
            <IconButton onClick={onClose} size="small" sx={{ color: isDark ? '#8b8b9a' : '#6b6b7b' }}>
              <ChevronLeftIcon sx={{ fontSize: 18 }} />
            </IconButton>
            <Typography
              variant="subtitle2"
              sx={{
                color: isDark ? '#8b8b9a' : '#6b6b7b',
                letterSpacing: '0.06em',
                fontSize: '0.68rem',
              }}
            >
              EXPLORER
            </Typography>
          </Stack>
          <Stack direction="row" spacing={0.25}>
            <Tooltip title="Refresh files">
              <span>
                <IconButton
                  onClick={onRefresh}
                  disabled={!isAuthenticated || loading}
                  size="small"
                  sx={{ color: isDark ? '#8b8b9a' : '#6b6b7b' }}
                >
                  <RefreshIcon
                    sx={{
                      fontSize: 16,
                      animation: loading ? 'spin 1s linear infinite' : 'none',
                      '@keyframes spin': {
                        from: { transform: 'rotate(0deg)' },
                        to: { transform: 'rotate(360deg)' },
                      },
                    }}
                  />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="New file">
              <span>
                <IconButton
                  onClick={onCreateServerFile}
                  disabled={!isAuthenticated}
                  size="small"
                  sx={{ color: isDark ? '#8b8b9a' : '#6b6b7b' }}
                >
                  <AddIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
        </Stack>
      </Box>

      <Divider />

      {/* Unauthenticated state */}
      {!isAuthenticated ? (
        <Box
          sx={{
            m: 1.5,
            p: 2,
            borderRadius: 2,
            backgroundColor: isDark ? 'rgba(99,102,241,0.07)' : 'rgba(99,102,241,0.04)',
            border: `1px solid ${isDark ? 'rgba(99,102,241,0.18)' : 'rgba(99,102,241,0.12)'}`,
            textAlign: 'center',
          }}
        >
          <LockOutlinedIcon sx={{ fontSize: 28, color: isDark ? '#6366f1' : '#4f46e5', mb: 1, opacity: 0.7 }} />
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, fontSize: '0.78rem', lineHeight: 1.5 }}>
            Sign in to save and manage your files in the cloud.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/login')}
            fullWidth
            size="small"
            sx={{ fontSize: '0.78rem' }}
          >
            Sign in
          </Button>
        </Box>
      ) : null}

      {/* File list */}
      <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto', py: 0.5 }}>
        {files.length === 0 && isAuthenticated ? (
          <Box sx={{ textAlign: 'center', py: 4, px: 2 }}>
            <FolderOpenIcon sx={{ fontSize: 36, color: isDark ? '#3a3a44' : '#d0d0d8', mb: 1 }} />
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.78rem' }}>
              No files yet. Create one to get started.
            </Typography>
          </Box>
        ) : (
          <List dense sx={{ py: 0 }}>
            {files.map((f) => {
              const lang = fileLanguageStyle(f.name)
              return (
                <ListItemButton
                  key={f.id}
                  onClick={() => onOpenFile(f)}
                  disabled={!isAuthenticated}
                  sx={{
                    mx: 0.75,
                    my: 0.25,
                    borderRadius: '6px',
                    px: 1,
                    py: 0.75,
                    '& .file-actions': { opacity: 0 },
                    '&:hover .file-actions': { opacity: 1 },
                  }}
                >
                  {/* Language badge */}
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: '6px',
                      backgroundColor: lang.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      mr: 1.25,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '0.5rem',
                        fontWeight: 700,
                        color: lang.color,
                        fontFamily: 'monospace',
                        letterSpacing: '-0.3px',
                      }}
                    >
                      {lang.label}
                    </Typography>
                  </Box>

                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: '0.8125rem',
                        fontWeight: 500,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        color: isDark ? '#d8d8e0' : '#1a1a26',
                      }}
                    >
                      {f.name}
                    </Typography>
                  </Box>

                  {/* Hover-reveal actions */}
                  <Stack
                    direction="row"
                    spacing={0}
                    className="file-actions"
                    sx={{ transition: 'opacity 0.15s', flexShrink: 0 }}
                  >
                    <Tooltip title="Download">
                      <IconButton
                        size="small"
                        onClick={(e) => { e.stopPropagation(); onDownloadFile(f) }}
                        sx={{ p: 0.4, color: isDark ? '#6b6b7b' : '#9b9bab' }}
                      >
                        <DownloadIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Rename">
                      <IconButton
                        size="small"
                        onClick={(e) => { e.stopPropagation(); onRenameFile(f) }}
                        sx={{ p: 0.4, color: isDark ? '#6b6b7b' : '#9b9bab' }}
                      >
                        <DriveFileRenameOutlineIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={(e) => { e.stopPropagation(); onDeleteFile(f) }}
                        sx={{
                          p: 0.4,
                          color: isDark ? '#6b6b7b' : '#9b9bab',
                          '&:hover': { color: '#f87171 !important' },
                        }}
                      >
                        <DeleteIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </ListItemButton>
              )
            })}
          </List>
        )}
      </Box>

      {/* Footer */}
      {isAuthenticated && (
        <Box
          sx={{
            px: 2,
            py: 1.25,
            borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
          }}
        >
          <Typography
            variant="body2"
            sx={{ fontSize: '0.7rem', color: isDark ? '#4a4a58' : '#b0b0c0' }}
          >
            {files.length} {files.length === 1 ? 'file' : 'files'}
          </Typography>
        </Box>
      )}
    </Box>
  )
}

// Re-export accent for convenience
export { accent }
