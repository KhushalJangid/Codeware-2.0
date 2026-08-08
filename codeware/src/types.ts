export type FileType = 'python' | 'java' | 'javascript' | 'go' | 'dart' | 'c' | 'cpp'

export type EditorLang =
  | 'python'
  | 'java'
  | 'javascript'
  | 'go'
  | 'dart'
  | 'c'
  | 'cpp'

export type RunnerLang = 'py' | 'java' | 'js' | 'go' | 'dart' | 'c' | 'cpp'

export type CodeFile = {
  id: number
  name: string
  fileType: FileType
}

export type FileTab = {
  id: number // -1 => local-only tab
  name: string
  fileType: FileType
  content: string
  initialContent: string
  dirty: boolean
}

export type User = {
  id: number
  first_name: string
  last_name: string
  email: string
}

export type TokenResponse = User & {
  access: string
  refresh: string
}

export type AuthSession = {
  user: User
  access: string
  refresh: string
}

