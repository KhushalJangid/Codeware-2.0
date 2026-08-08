import { useEffect, useMemo, useRef, useState } from 'react'
import { Box, IconButton, InputBase, Stack, Tooltip, Typography } from '@mui/material'
import ClearAllIcon from '@mui/icons-material/ClearAll'
import StopIcon from '@mui/icons-material/Stop'
import type { RunnerLang } from '../types'
import { CompilerClient, type CompilerMessage } from '../services/compilerWs'
import { useAppTheme } from '../contexts/ThemeContext'

export function ConsolePane(props: {
  visible: boolean
  height: number
  onResizeStart: (e: React.MouseEvent<HTMLDivElement>) => void
  runner: { lang: RunnerLang; code: string } | null
}) {
  const { visible, height, onResizeStart, runner } = props
  const { mode } = useAppTheme()
  const isDark = mode === 'dark'

  const clientRef = useRef<CompilerClient | null>(null)
  const [output, setOutput] = useState('')
  const [input, setInput] = useState('')
  const [connected, setConnected] = useState(false)
  const outputRef = useRef<HTMLDivElement>(null)

  const footerHint = useMemo(() => {
    if (!runner) return '// Run a file to start an interactive session'
    return connected ? '// Connected — type input and press Enter' : '// Connecting...'
  }, [runner, connected])

  function append(m: CompilerMessage) {
    const next = m.output ?? ''
    setOutput((prev) => prev + next)
  }

  function stop() {
    clientRef.current?.close()
    clientRef.current = null
    setConnected(false)
  }

  useEffect(() => {
    if (!runner) return

    stop()
    setOutput('')
    setInput('')

    const client = new CompilerClient()
    clientRef.current = client
    client.connect({
      onOpen: () => {
        setConnected(true)
        client.sendCode(runner.lang, runner.code)
      },
      onClose: () => setConnected(false),
      onMessage: append,
      onError: () => setConnected(false),
    })

    return () => {
      stop()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runner?.lang, runner?.code])

  // Auto-scroll output
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [output])

  if (!visible) return null

  const terminalBg = isDark ? '#080810' : '#f0f0f4'

  return (
    <Box
      sx={(t) => ({
        height,
        borderTop: `1px solid ${t.palette.divider}`,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 60,
        overflow: 'hidden',
      })}
    >
      {/* Resize handle */}
      <Box
        onMouseDown={onResizeStart}
        sx={{
          height: 5,
          cursor: 'row-resize',
          flex: '0 0 auto',
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: 40,
            height: 3,
            borderRadius: 2,
            backgroundColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.15)',
            transition: 'background 0.2s, width 0.2s',
          },
          '&:hover::after': {
            backgroundColor: '#6366f1',
            width: 60,
          },
        }}
      />

      {/* Console header */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={(t) => ({
          px: 1.5,
          py: 0.75,
          backgroundColor: t.palette.background.paper,
          borderBottom: `1px solid ${t.palette.divider}`,
          flex: '0 0 auto',
        })}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          {/* macOS-style traffic lights */}
          <Stack direction="row" spacing={0.5}>
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#f87171' }} />
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#fbbf24' }} />
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: connected ? '#4ade80' : (isDark ? '#3a3a44' : '#d0d0d8'),
                transition: 'background-color 0.3s',
              }}
            />
          </Stack>
          <Typography
            variant="subtitle2"
            sx={{
              color: isDark ? '#8b8b9a' : '#6b6b7b',
              fontSize: '0.7rem',
              letterSpacing: '0.08em',
            }}
          >
            TERMINAL
          </Typography>
          {connected && (
            <Box
              sx={{
                px: 0.75,
                py: 0.1,
                borderRadius: 1,
                backgroundColor: 'rgba(74,222,128,0.1)',
                border: '1px solid rgba(74,222,128,0.2)',
              }}
            >
              <Typography sx={{ fontSize: '0.6rem', color: '#4ade80', fontWeight: 600 }}>
                RUNNING
              </Typography>
            </Box>
          )}
        </Stack>

        <Stack direction="row" spacing={0.25}>
          <Tooltip title="Clear output">
            <IconButton
              size="small"
              onClick={() => setOutput('')}
              sx={{ color: isDark ? '#6b6b7b' : '#9b9bab' }}
            >
              <ClearAllIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Stop process">
            <IconButton
              size="small"
              onClick={stop}
              sx={{
                color: connected ? '#f87171' : (isDark ? '#3a3a44' : '#d0d0d8'),
                '&:hover': { backgroundColor: 'rgba(248,113,113,0.1)' },
              }}
            >
              <StopIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      {/* Output area */}
      <Box
        ref={outputRef}
        sx={{
          flex: 1,
          minHeight: 0,
          overflow: 'auto',
          fontFamily: "'JetBrains Mono', 'Fira Code', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Courier New', monospace",
          fontSize: 13,
          lineHeight: 1.6,
          backgroundColor: terminalBg,
          color: output
            ? (isDark ? '#4ade80' : '#1a7a3a')
            : (isDark ? '#3a3a50' : '#9b9bb0'),
          px: 2,
          py: 1.5,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all',
        }}
      >
        {output || footerHint}
      </Box>

      {/* Input area */}
      <Box
        sx={{
          px: 1.5,
          py: 0.75,
          backgroundColor: isDark ? '#0c0c14' : '#e8e8f0',
          borderTop: isDark
            ? '1px solid rgba(99,102,241,0.15)'
            : '1px solid rgba(99,102,241,0.12)',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Typography
          sx={{
            fontFamily: 'monospace',
            fontSize: 13,
            color: '#6366f1',
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          &gt;
        </Typography>
        <InputBase
          fullWidth
          placeholder={connected ? 'Type input...' : 'No active session'}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              if (!input.trim()) return
              clientRef.current?.sendInput(input)
              setOutput((prev) => prev + input + '\n')
              setInput('')
            }
          }}
          disabled={!connected}
          sx={{
            fontFamily: "'JetBrains Mono', 'Fira Code', ui-monospace, monospace",
            fontSize: 13,
            color: isDark ? '#c4b5fd' : '#4338ca',
            '& input': { padding: 0 },
            '& input::placeholder': {
              color: isDark ? '#3a3a50' : '#9b9bb0',
              opacity: 1,
              fontSize: 12,
            },
          }}
        />
      </Box>
    </Box>
  )
}
