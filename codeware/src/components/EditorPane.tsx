import Editor from '@monaco-editor/react'
import { Box } from '@mui/material'
import { useEffect, useRef } from 'react'
import type { editor as MonacoEditor } from 'monaco-editor'
import type { FileTab } from '../types'

const MONACO_LANG: Record<FileTab['fileType'], string> = {
  python: 'python',
  java: 'java',
  javascript: 'javascript',
  go: 'go',
  dart: 'dart',
  c: 'c',
  cpp: 'cpp',
}

export function EditorPane(props: {
  tab: FileTab | null
  onChange: (next: string) => void
  themeMode: 'light' | 'dark'
  layoutSignal: string
}) {
  const { tab, onChange, themeMode, layoutSignal } = props
  const editorRef = useRef<MonacoEditor.IStandaloneCodeEditor | null>(null)

  useEffect(() => {
    // Ensure Monaco re-measures after surrounding layout changes (sidebar/console).
    editorRef.current?.layout()
  }, [layoutSignal])

  return (
    <Box sx={{ flex: 1, minHeight: 0, overflow: 'hidden', height: '100%'}}>
      <Editor
        height="100%"
        language={tab ? MONACO_LANG[tab.fileType] : 'plaintext'}
        value={
          tab
            ? tab.content
            : [
                '/**',
                ' * Welcome to Codeware — your cloud code editor.',
                ' *',
                ' * Getting started:',
                ' *   ➕  Create a new local file (+ button in toolbar)',
                ' *   ⬆️  Upload a local file from your machine',
                ' *   ☰  Open the sidebar to load your saved files',
                ' *',
                ' * Tip: Sign in to save, sync, and manage files in the cloud.',
                ' */',
              ].join('\n')
        }
        onChange={(v) => onChange(v ?? '')}
        onMount={(editor) => {
          editorRef.current = editor
          editor.layout()
        }}
        theme={themeMode === 'dark' ? 'vs-dark' : 'light'}
        options={{
          readOnly: !tab,
          fontSize: 16,
          minimap: { enabled: false },
          tabSize: 2,
          automaticLayout: true,
          scrollBeyondLastLine: false,
        }}
      />
    </Box>
  )
}

