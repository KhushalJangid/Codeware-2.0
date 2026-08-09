import './App.css'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Box } from '@mui/material'
// import { AppShell } from './components/AppShell'
import { Sidebar } from './components/Sidebar'
import { TabBar } from './components/TabBar'
import { EditorPane } from './components/EditorPane'
import { ConsolePane } from './components/ConsolePane'
import { StatusBar } from './components/StatusBar'

import { CreateFileDialog, type CreateFileResult } from './components/CreateFileDialog'
import type { CodeFile, CursorPos, FileTab, FileType } from './types'
import { useAuth } from './contexts/AuthContext'
import { useAppTheme } from './contexts/ThemeContext'
import { boilerplate, downloadTextFile, fileTypeFromName, runnerLangFromFileType } from './utils/files'
import * as filesApi from './services/files'

function App() {
  const { isAuthenticated } = useAuth()
  const { mode } = useAppTheme()

  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [files, setFiles] = useState<CodeFile[]>([])
  const [filesLoading, setFilesLoading] = useState(false)

  const [tabs, setTabs] = useState<FileTab[]>([])
  const [activeIndex, setActiveIndex] = useState(-1)

  const [consoleHeight, setConsoleHeight] = useState(220)
  const [consoleVisible, setConsoleVisible] = useState(true)
  const [runner, setRunner] = useState<{ lang: ReturnType<typeof runnerLangFromFileType>; code: string } | null>(null)

  // Status Bar state
  const [cursorPos, setCursorPos] = useState<CursorPos>({ line: 1, column: 1, selectedCount: 0 })
  const [tabSize, setTabSize] = useState<number>(2)
  const [encoding, setEncoding] = useState<string>('UTF-8')
  const [eol, setEol] = useState<'LF' | 'CRLF'>('LF')

  const [createFileOpen, setCreateFileOpen] = useState(false)
  const [createFileMode, setCreateFileMode] = useState<'server' | 'local'>('local')

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const draggingRef = useRef(false)
  const dragStartYRef = useRef(0)
  const dragStartHRef = useRef(220)

  const activeTab = activeIndex >= 0 ? tabs[activeIndex] : null

  const canSave = useMemo(() => {
    return Boolean(isAuthenticated && activeTab)
  }, [isAuthenticated, activeTab])

  async function refreshFiles() {
    if (!isAuthenticated) {
      setFiles([])
      return
    }
    setFilesLoading(true)
    try {
      const list = await filesApi.listFiles()
      setFiles(list)
    } catch (err) {
      console.error('Failed to list files:', err)
      setFiles([])
    } finally {
      setFilesLoading(false)
    }
  }

  useEffect(() => {
    refreshFiles()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated])

  async function openServerFile(file: CodeFile) {
    if (!isAuthenticated) return
    const existing = tabs.findIndex((t) => t.id === file.id)
    if (existing >= 0) {
      setActiveIndex(existing)
      return
    }
    const tab = await filesApi.openFile(file.id)
    setTabs((prev) => {
      const idx = prev.length
      setActiveIndex(idx)
      return [...prev, tab]
    })
  }

  function openCreateDialog(m: 'server' | 'local') {
    setCreateFileMode(m)
    setCreateFileOpen(true)
  }

  async function handleCreateFile(result: CreateFileResult) {
    const { name, fileType } = result
    const content = boilerplate(fileType, name)

    if (createFileMode === 'server') {
      if (!isAuthenticated) return
      const id = await filesApi.createFile(name, content)
      await refreshFiles()
      const tab: FileTab = { id, name, fileType, content, initialContent: content, dirty: false }
      setTabs((prev) => {
        const idx = prev.length
        setActiveIndex(idx)
        return [...prev, tab]
      })
    } else {
      const tab: FileTab = { id: -1, name, fileType, content, initialContent: content, dirty: false }
      setTabs((prev) => {
        const idx = prev.length
        setActiveIndex(idx)
        return [...prev, tab]
      })
    }
  }

  async function saveActive() {
    if (!activeTab || !isAuthenticated) return
    const res = await filesApi.saveFile(activeTab.id, activeTab.name, activeTab.content)
    const newId = res.fileId
    setTabs((prev) => {
      const next = [...prev]
      next[activeIndex] = {
        ...activeTab,
        id: newId,
        initialContent: activeTab.content,
        dirty: false,
      }
      return next
    })
    await refreshFiles()
  }

  function runActive() {
    if (!activeTab) return
    setRunner({
      lang: runnerLangFromFileType(activeTab.fileType),
      code: activeTab.content,
    })
  }

  function downloadActive() {
    if (!activeTab) return
    downloadTextFile(activeTab.name, activeTab.content)
  }

  async function downloadServerFile(file: CodeFile) {
    if (!isAuthenticated) return
    const tab = await filesApi.openFile(file.id)
    downloadTextFile(tab.name, tab.content)
  }

  async function renameServerFile(file: CodeFile) {
    const name = window.prompt('New name:', file.name)
    if (!name) return
    await filesApi.renameFile(file.id, name)
    await refreshFiles()
    setTabs((prev) =>
      prev.map((t) => (t.id === file.id ? { ...t, name, fileType: fileTypeFromName(name) } : t)),
    )
  }

  async function deleteServerFile(file: CodeFile) {
    const ok = window.confirm(`Delete ${file.name}?`)
    if (!ok) return
    await filesApi.deleteFile(file.id)
    await refreshFiles()
    setTabs((prev) => prev.filter((t) => t.id !== file.id))
    setActiveIndex((prev) => {
      if (activeTab?.id === file.id) return -1
      return prev
    })
  }

  function closeTab(idx: number) {
    setTabs((prev) => {
      const next = prev.filter((_, i) => i !== idx)
      setActiveIndex((ai) => {
        if (next.length === 0) return -1
        if (ai === idx) return Math.min(idx, next.length - 1)
        if (ai > idx) return ai - 1
        return ai
      })
      return next
    })
  }

  function onEditorChange(next: string) {
    if (!activeTab) return
    setTabs((prev) => {
      const copy = [...prev]
      const t = copy[activeIndex]!
      copy[activeIndex] = {
        ...t,
        content: next,
        dirty: next !== t.initialContent,
      }
      return copy
    })
  }

  function handleLanguageChange(newLang: FileType) {
    if (activeIndex < 0) return
    setTabs((prev) => {
      const copy = [...prev]
      copy[activeIndex] = {
        ...copy[activeIndex],
        fileType: newLang,
      }
      return copy
    })
  }

  function uploadLocalClick() {
    fileInputRef.current?.click()
  }

  async function onUploadFileSelected(file: File) {
    const text = await file.text()
    const ft = fileTypeFromName(file.name)
    const tab: FileTab = {
      id: -1,
      name: file.name,
      fileType: ft,
      content: text,
      initialContent: text,
      dirty: false,
    }
    setTabs((prev) => {
      const idx = prev.length
      setActiveIndex(idx)
      return [...prev, tab]
    })
  }

  function onResizeStart(e: React.MouseEvent<HTMLDivElement>) {
    draggingRef.current = true
    dragStartYRef.current = e.clientY
    dragStartHRef.current = consoleHeight
    window.addEventListener('mousemove', onResizeMove)
    window.addEventListener('mouseup', onResizeEnd)
  }

  function onResizeMove(e: MouseEvent) {
    if (!draggingRef.current) return
    const dy = dragStartYRef.current - e.clientY
    const next = Math.min(600, Math.max(80, dragStartHRef.current + dy))
    setConsoleHeight(next)
  }

  function onResizeEnd() {
    draggingRef.current = false
    window.removeEventListener('mousemove', onResizeMove)
    window.removeEventListener('mouseup', onResizeEnd)
  }

  return (
    <div className="cw-root">
      {/* <AppShell> */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          minWidth: 0,
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: sidebarOpen ? '340px 1fr' : '0px 1fr',
          transition: 'grid-template-columns 180ms ease',
        }}
      >
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          files={files}
          loading={filesLoading}
          isAuthenticated={isAuthenticated}

          onRefresh={refreshFiles}
          onOpenFile={(f) => {
            void openServerFile(f)
          }}
          onCreateServerFile={() => openCreateDialog('server')}
          onRenameFile={(f) => void renameServerFile(f)}
          onDeleteFile={(f) => void deleteServerFile(f)}
          onDownloadFile={(f) => void downloadServerFile(f)}
        />

        <Box
          sx={{
            minHeight: 0,
            minWidth: 0,
            height: '100%',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <TabBar
            tabs={tabs}
            activeIndex={activeIndex}
            onSwitch={setActiveIndex}
            onClose={closeTab}
            onRun={runActive}
            onSave={() => void saveActive()}
            onUploadLocal={uploadLocalClick}
            onDownload={downloadActive}
            onCreateLocal={() => openCreateDialog('local')}
            onOpenSidebar={() => setSidebarOpen((s) => !s)}
            canSave={canSave}
          />

          <Box sx={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ flex: 1, minHeight: 0 }}>
              <EditorPane
                tab={activeTab}
                onChange={onEditorChange}
                themeMode={mode}
                layoutSignal={`${sidebarOpen}-${consoleHeight}-${activeIndex}-${mode}`}
                onCursorChange={setCursorPos}
                tabSize={tabSize}
                eol={eol}
              />
            </Box>
            <ConsolePane
              visible={consoleVisible}
              height={consoleHeight}
              onResizeStart={onResizeStart}
              runner={runner}
            />
          </Box>
        </Box>
      </Box>

      <StatusBar
        cursorPos={cursorPos}
        tabSize={tabSize}
        onTabSizeChange={setTabSize}
        encoding={encoding}
        onEncodingChange={setEncoding}
        eol={eol}
        onEolChange={setEol}
        activeLanguage={activeTab?.fileType ?? null}
        onLanguageChange={handleLanguageChange}
        onToggleSidebar={() => setSidebarOpen((s) => !s)}
        onToggleConsole={() => setConsoleVisible((v) => !v)}
        sidebarOpen={sidebarOpen}
        consoleVisible={consoleVisible}
      />
      {/* </AppShell> */}

      <input
        ref={fileInputRef}
        id="console-input"
        type="file"
        style={{ display: 'none' }}
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) void onUploadFileSelected(f)
          e.target.value = ''
        }}
      />

      <CreateFileDialog
        open={createFileOpen}
        onClose={() => setCreateFileOpen(false)}
        onConfirm={handleCreateFile}
        mode={createFileMode}
      />
    </div>
  )
}


export default App
