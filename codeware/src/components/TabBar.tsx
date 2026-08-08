import CloseIcon from '@mui/icons-material/Close'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import SaveIcon from '@mui/icons-material/Save'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import DownloadIcon from '@mui/icons-material/Download'
import AddIcon from '@mui/icons-material/Add'
import MenuIcon from '@mui/icons-material/Menu'
import {
  Box,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from '@mui/material'
import type { FileTab } from '../types'
import { useAppTheme } from '../contexts/ThemeContext'
import { accent } from '../contexts/ThemeContext'

export function TabBar(props: {
  tabs: FileTab[]
  activeIndex: number
  onSwitch: (idx: number) => void
  onClose: (idx: number) => void
  onRun: () => void
  onSave: () => void
  onUploadLocal: () => void
  onDownload: () => void
  onCreateLocal: () => void
  onOpenSidebar: () => void
  canSave: boolean
}) {
  const {
    tabs,
    activeIndex,
    onSwitch,
    onClose,
    onRun,
    onSave,
    onUploadLocal,
    onDownload,
    onCreateLocal,
    onOpenSidebar,
    canSave,
  } = props

  const { mode } = useAppTheme()
  const isDark = mode === 'dark'
  const activeTab = activeIndex >= 0 ? tabs[activeIndex] : null

  return (
    <Box
      sx={(t) => ({
        px: 0.5,
        borderBottom: `1px solid ${t.palette.divider}`,
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        minHeight: 44,
        backgroundColor: isDark ? '#0d0d0f' : '#ffffff',
      })}
    >
      <Tooltip title="Toggle sidebar">
        <IconButton
          size="small"
          onClick={onOpenSidebar}
          sx={{ color: isDark ? '#8b8b9a' : '#6b6b7b', flexShrink: 0 }}
        >
          <MenuIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Tooltip>

      {/* Tabs */}
      <Box sx={{ flex: 1, minWidth: 0, overflow: 'hidden', backgroundColor: 'transparent' }}>
        {tabs.length ? (
          <Tabs
            value={activeIndex}
            onChange={(_, v) => onSwitch(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              minHeight: 44,
              backgroundColor: 'transparent',
              '& .MuiTabs-scroller': { backgroundColor: 'transparent' },
              '& .MuiTabScrollButton-root': {
                color: isDark ? '#8b8b9a' : '#6b6b7b',
              },
            }}
          >
            {tabs.map((t, idx) => (
              <Tab
                key={`${t.id}:${t.name}:${idx}`}
                value={idx}
                disableRipple
                label={
                  <Stack
                    direction="row"
                    spacing={0.75}
                    alignItems="center"
                    sx={{ maxWidth: 240, position: 'relative' }}
                  >
                    <Typography
                      sx={{
                        fontSize: '0.8rem',
                        fontWeight: idx === activeIndex ? 500 : 400,
                        maxWidth: 160,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        color: idx === activeIndex
                          ? (isDark ? '#e8e8ed' : '#111118')
                          : (isDark ? '#8b8b9a' : '#6b6b7b'),
                      }}
                    >
                      {t.name}
                    </Typography>

                    {/* Animated dirty dot */}
                    {t.dirty ? (
                      <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          backgroundColor: '#f59e0b',
                          flexShrink: 0,
                          animation: 'pulse 2s ease-in-out infinite',
                          '@keyframes pulse': {
                            '0%, 100%': { opacity: 1 },
                            '50%': { opacity: 0.4 },
                          },
                        }}
                      />
                    ) : null}

                    {/* Close button — visible on tab hover or active */}
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation()
                        onClose(idx)
                      }}
                      sx={{
                        p: 0.2,
                        width: 16,
                        height: 16,
                        color: isDark ? '#6b6b7b' : '#9b9bab',
                        opacity: idx === activeIndex ? 1 : 0,
                        '.MuiTab-root:hover &': { opacity: 1 },
                        '&:hover': {
                          color: isDark ? '#e8e8ed' : '#111118',
                          backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                        },
                        transition: 'opacity 0.1s, color 0.1s',
                      }}
                    >
                      <CloseIcon sx={{ fontSize: 11 }} />
                    </IconButton>
                  </Stack>
                }
                sx={{ minHeight: 44, px: 1.25, py: 0, backgroundColor: 'transparent' }}
              />
            ))}
          </Tabs>
        ) : (
          <Typography
            variant="body2"
            sx={{
              px: 1.5,
              color: isDark ? '#4a4a58' : '#b0b0c0',
              fontSize: '0.78rem',
              fontStyle: 'italic',
            }}
          >
            Open a file or create a new one
          </Typography>
        )}
      </Box>

      {/* Action buttons */}
      <Stack direction="row" spacing={0.25} alignItems="center" sx={{ flexShrink: 0, pr: 0.5 }}>
        {/* Divider */}
        <Box
          sx={{
            width: 1,
            height: 18,
            backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
            mx: 0.5,
          }}
        />

        {/* Run — special styling */}
        <Tooltip title="Run file">
          <span>
            <IconButton
              size="small"
              onClick={onRun}
              disabled={!activeTab}
              sx={{
                color: activeTab ? '#4ade80' : (isDark ? '#4a4a58' : '#c0c0c8'),
                '&:hover': {
                  backgroundColor: 'rgba(74,222,128,0.1)',
                  color: '#4ade80',
                },
                '&.Mui-disabled': { color: isDark ? '#3a3a44' : '#d0d0d8' },
              }}
            >
              <PlayArrowIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title={canSave ? 'Save (Ctrl+S)' : 'Login required to save'}>
          <span>
            <IconButton
              size="small"
              onClick={onSave}
              disabled={!activeTab || !canSave}
              sx={{
                color: isDark ? '#8b8b9a' : '#6b6b7b',
                '&.Mui-disabled': { color: isDark ? '#3a3a44' : '#d0d0d8' },
              }}
            >
              <SaveIcon sx={{ fontSize: 17 }} />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title="Upload local file">
          <IconButton
            size="small"
            onClick={onUploadLocal}
            sx={{ color: isDark ? '#8b8b9a' : '#6b6b7b' }}
          >
            <UploadFileIcon sx={{ fontSize: 17 }} />
          </IconButton>
        </Tooltip>

        <Tooltip title="Download active file">
          <span>
            <IconButton
              size="small"
              onClick={onDownload}
              disabled={!activeTab}
              sx={{
                color: isDark ? '#8b8b9a' : '#6b6b7b',
                '&.Mui-disabled': { color: isDark ? '#3a3a44' : '#d0d0d8' },
              }}
            >
              <DownloadIcon sx={{ fontSize: 17 }} />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title="New local file">
          <IconButton
            size="small"
            onClick={onCreateLocal}
            sx={{
              color: isDark ? accent.light : accent.dark,
              backgroundColor: isDark ? 'rgba(99,102,241,0.1)' : 'rgba(99,102,241,0.06)',
              '&:hover': {
                backgroundColor: isDark ? 'rgba(99,102,241,0.18)' : 'rgba(99,102,241,0.12)',
              },
            }}
          >
            <AddIcon sx={{ fontSize: 17 }} />
          </IconButton>
        </Tooltip>
      </Stack>
    </Box>
  )
}
