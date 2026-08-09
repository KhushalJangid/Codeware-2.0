import Editor from '@monaco-editor/react'
import { Box } from '@mui/material'
import { useEffect, useRef } from 'react'
import type { editor as MonacoEditor } from 'monaco-editor'
import type { CursorPos, FileTab } from '../types'

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
  onCursorChange?: (pos: CursorPos) => void
  tabSize?: number
  eol?: 'LF' | 'CRLF'
}) {
  const { tab, onChange, themeMode, layoutSignal, onCursorChange, tabSize = 2, eol = 'LF' } = props
  const editorRef = useRef<MonacoEditor.IStandaloneCodeEditor | null>(null)
  const monacoRef = useRef<typeof import('monaco-editor') | null>(null)

  useEffect(() => {
    // Ensure Monaco re-measures after surrounding layout changes (sidebar/console).
    editorRef.current?.layout()
  }, [layoutSignal])

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions({ tabSize })
    }
  }, [tabSize])

  useEffect(() => {
    if (editorRef.current && monacoRef.current) {
      const model = editorRef.current.getModel()
      if (model) {
        const eolSeq = eol === 'CRLF'
          ? monacoRef.current.editor.EndOfLineSequence.CRLF
          : monacoRef.current.editor.EndOfLineSequence.LF
        model.setEOL(eolSeq)
      }
    }
  }, [eol])

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
        onMount={(editor, monaco) => {
          editorRef.current = editor
          monacoRef.current = monaco
          editor.layout()

          // Helper to update cursor position & selection info
          const updateCursor = () => {
            if (!onCursorChange) return
            const pos = editor.getPosition()
            const selection = editor.getSelection()
            let selectedCount = 0
            if (selection && !selection.isEmpty()) {
              const model = editor.getModel()
              if (model) {
                selectedCount = model.getValueLengthInRange(selection)
              }
            }
            onCursorChange({
              line: pos?.lineNumber ?? 1,
              column: pos?.column ?? 1,
              selectedCount,
            })
          }

          editor.onDidChangeCursorPosition(updateCursor)
          editor.onDidChangeCursorSelection(updateCursor)
          updateCursor()
        }}
        theme={themeMode === 'dark' ? 'vs-dark' : 'light'}
        options={{
          readOnly: !tab,
          fontSize: 16,
          minimap: { enabled: false },
          tabSize,
          automaticLayout: true,
          scrollBeyondLastLine: false,
        }}
      />
    </Box>
  )
}


