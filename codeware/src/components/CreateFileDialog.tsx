import { useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  type SelectChangeEvent,
} from '@mui/material'
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined'
import type { FileType } from '../types'
import { useAppTheme } from '../contexts/ThemeContext'
import { accent } from '../contexts/ThemeContext'
import { FaPython, FaJs, FaJava, FaGolang, FaDartLang, FaFile } from 'react-icons/fa6'
import {
  SiCplusplus,
  SiC,
} from "@icons-pack/react-simple-icons";

// ─── Language config ────────────────────────────────────────────────────────

type LangOption = {
  fileType: FileType
  label: string
  ext: string
  color: string
  bg: string
  icon: React.ReactNode
}

const LANGUAGES: LangOption[] = [
  { fileType: 'python', label: 'Python', ext: '.py', color: '#60a5fa', bg: 'rgba(96,165,250,0.12)', icon: <FaPython /> },
  { fileType: 'javascript', label: 'JavaScript', ext: '.js', color: '#fbbf24', bg: 'rgba(251,191,36,0.12)', icon: <FaJs /> },
  { fileType: 'java', label: 'Java', ext: '.java', color: '#fb923c', bg: 'rgba(251,146,60,0.12)', icon: <FaJava /> },
  { fileType: 'go', label: 'Go', ext: '.go', color: '#34d399', bg: 'rgba(52,211,153,0.12)', icon: <FaGolang /> },
  { fileType: 'c', label: 'C', ext: '.c', color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', icon: <SiCplusplus /> },
  { fileType: 'cpp', label: 'C++', ext: '.cpp', color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', icon: <SiC size={18} /> },
  { fileType: 'dart', label: 'Dart', ext: '.dart', color: '#38bdf8', bg: 'rgba(56,189,248,0.12)', icon: <FaDartLang /> },
]

// ─── Props ───────────────────────────────────────────────────────────────────

export type CreateFileResult = {
  name: string
  fileType: FileType
}

export function CreateFileDialog(props: {
  open: boolean
  onClose: () => void
  onConfirm: (result: CreateFileResult) => Promise<void> | void
  /** 'server' shows loading spinner + "Save to cloud" hint; 'local' is lightweight */
  mode: 'server' | 'local'
}) {
  const { open, onClose, onConfirm, mode } = props
  const { mode: themeMode } = useAppTheme()
  const isDark = themeMode === 'dark'

  const [selectedLang, setSelectedLang] = useState<FileType>('python')
  const [fileName, setFileName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const lang = useMemo(
    () => LANGUAGES.find((l) => l.fileType === selectedLang) ?? LANGUAGES[0]!,
    [selectedLang],
  )

  // Auto-update file extension when language changes
  useEffect(() => {
    if (!open) return
    setFileName((prev) => {
      if (!prev) return `main${lang.ext}`
      // Replace existing extension with new one
      const withoutExt = prev.replace(/\.[^.]+$/, '')
      return `${withoutExt}${lang.ext}`
    })
  }, [selectedLang, lang.ext, open])

  // Reset when dialog opens
  useEffect(() => {
    if (open) {
      setSelectedLang('python')
      setFileName('main.py')
      setError(null)
      setBusy(false)
    }
  }, [open])

  function validate(name: string): string | null {
    if (!name.trim()) return 'File name cannot be empty.'
    if (!/^[\w\-. ]+$/.test(name)) return 'File name contains invalid characters.'
    return null
  }

  async function handleConfirm() {
    const validationError = validate(fileName.trim())
    if (validationError) { setError(validationError); return }
    setError(null)
    setBusy(true)
    try {
      await onConfirm({ name: fileName.trim(), fileType: selectedLang })
      onClose()
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setBusy(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !busy) void handleConfirm()
    if (e.key === 'Escape') onClose()
  }

  return (
    <Dialog open={open} onClose={busy ? undefined : onClose} fullWidth maxWidth="xs">
      <DialogContent sx={{ p: 0, overflow: 'hidden' }}>
        {/* Header */}
        <Box
          sx={{
            background: accent.gradient,
            px: 3,
            pt: 2.5,
            pb: 3,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative circles */}
          <Box sx={{
            position: 'absolute', width: 100, height: 100, borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.08)', top: -30, right: -20,
          }} />
          <Box sx={{
            position: 'absolute', width: 60, height: 60, borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.06)', bottom: -15, left: 30,
          }} />

          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ position: 'relative' }}>
            <Box sx={{
              width: 36, height: 36, borderRadius: '10px',
              backgroundColor: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(4px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18,
            }}>
              <FaFile />
            </Box>

            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#fff', letterSpacing: '-0.01em' }}>
                New File
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>
                {mode === 'server' ? 'Saved to your cloud account' : 'Local session only'}
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* Form body */}
        <Stack spacing={2.5} sx={{ px: 3, pt: 3, pb: 3 }} onKeyDown={handleKeyDown}>

          {/* Language selector */}
          <Box>
            <Typography
              sx={{
                fontSize: '0.72rem',
                fontWeight: 600,
                letterSpacing: '0.06em',
                color: isDark ? '#8b8b9a' : '#6b6b7b',
                mb: 0.75,
                textTransform: 'uppercase',
              }}
            >
              Language
            </Typography>

            <Select
              fullWidth
              size="small"
              value={selectedLang}
              onChange={(e: SelectChangeEvent<FileType>) =>
                setSelectedLang(e.target.value as FileType)
              }
              sx={{
                borderRadius: '8px',
                fontSize: '0.8125rem',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: accent.main,
                  boxShadow: `0 0 0 3px ${accent.main}22`,
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.2)',
                },
              }}
              renderValue={(val) => {
                const l = LANGUAGES.find((x) => x.fileType === val)!
                return (
                  <Stack direction="row" spacing={1.25} alignItems="center">
                    <Box sx={{
                      width: 26, height: 26, borderRadius: '6px',
                      backgroundColor: l.bg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      {l.icon}
                    </Box>
                    <Typography sx={{ fontSize: '0.8125rem', fontWeight: 500 }}>
                      {l.label}
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: isDark ? '#6b6b7b' : '#9b9bab', ml: 'auto !important' }}>
                      {l.ext}
                    </Typography>
                  </Stack>
                )
              }}
            >
              {LANGUAGES.map((l) => (
                <MenuItem key={l.fileType} value={l.fileType} sx={{ py: 1 }}>
                  <Stack direction="row" spacing={1.25} alignItems="center" sx={{ width: '100%' }}>
                    <Box sx={{
                      width: 28, height: 28, borderRadius: '7px',
                      backgroundColor: l.bg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      {l.icon}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontSize: '0.8125rem', fontWeight: 500 }}>
                        {l.label}
                      </Typography>
                    </Box>
                    <Typography sx={{ fontSize: '0.75rem', color: isDark ? '#4a4a58' : '#b0b0c0', fontFamily: 'monospace' }}>
                      {l.ext}
                    </Typography>
                  </Stack>
                </MenuItem>
              ))}
            </Select>
          </Box>

          {/* File name input */}
          <Box>
            <Typography
              sx={{
                fontSize: '0.72rem',
                fontWeight: 600,
                letterSpacing: '0.06em',
                color: isDark ? '#8b8b9a' : '#6b6b7b',
                mb: 0.75,
                textTransform: 'uppercase',
              }}
            >
              File Name
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={fileName}
              onChange={(e) => {
                setFileName(e.target.value)
                setError(null)
              }}
              autoFocus
              placeholder={`e.g. main${lang.ext}`}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <InsertDriveFileOutlinedIcon sx={{ fontSize: 17, color: isDark ? '#6b6b7b' : '#9b9bab' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                  fontSize: '0.8125rem',
                },
              }}
            />
          </Box>

          {/* Preview pill */}
          <Box
            sx={{
              px: 2,
              py: 1.25,
              borderRadius: 2,
              backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <Box sx={{
              width: 30, height: 30, borderRadius: '7px',
              backgroundColor: lang.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              {lang.icon}
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{
                fontSize: '0.78rem',
                color: isDark ? '#d8d8e0' : '#2a2a38',
                fontWeight: 500,
                fontFamily: 'monospace',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {fileName || `main${lang.ext}`}
              </Typography>
              <Typography sx={{ fontSize: '0.68rem', color: isDark ? '#4a4a58' : '#b0b0c0' }}>
                {lang.label} · {lang.ext}
              </Typography>
            </Box>
          </Box>

          {error && (
            <Alert severity="error" sx={{ borderRadius: 2, fontSize: '0.78rem', py: 0.5 }}>
              {error}
            </Alert>
          )}

          {/* Actions */}
          <Stack direction="row" spacing={1.5} pt={0.5}>
            <Button
              onClick={onClose}
              disabled={busy}
              fullWidth
              variant="outlined"
              sx={{
                borderRadius: 2,
                fontSize: '0.8125rem',
                borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)',
                color: isDark ? '#8b8b9a' : '#6b6b7b',
                '&:hover': {
                  borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                  backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => void handleConfirm()}
              variant="contained"
              disabled={!fileName.trim() || busy}
              fullWidth
              sx={{
                borderRadius: 2,
                fontSize: '0.8125rem',
                fontWeight: 600,
                py: 1,
              }}
            >
              {busy ? (
                <CircularProgress size={16} sx={{ color: 'rgba(255,255,255,0.7)' }} />
              ) : mode === 'server' ? (
                'Create & Save'
              ) : (
                'Create File'
              )}
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
