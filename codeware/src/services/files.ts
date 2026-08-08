import type { CodeFile, FileTab } from '../types'
import { http } from './http'
import { encodeFileContent } from '../utils/files'
import { fileTypeFromName } from '../utils/files'

export async function listFiles(): Promise<CodeFile[]> {
  const res = await http.get<{ data: Array<{ id: number; name: string }> }>('/files/list')
  return res.data.data.map((f) => ({
    id: f.id,
    name: f.name,
    fileType: fileTypeFromName(f.name),
  }))
}

export async function openFile(fileId: number): Promise<FileTab> {
  const res = await http.get<{ data: { id: number; name: string; contents: string } }>(
    `/files`,
    { params: { file_id: fileId } },
  )
  const d = res.data.data
  return {
    id: d.id,
    name: d.name,
    fileType: fileTypeFromName(d.name),
    content: d.contents ?? '',
    initialContent: d.contents ?? '',
    dirty: false,
  }
}

export async function createFile(name: string, content: string): Promise<number> {
  const res = await http.post<{ file_id: number }>('/files', {
    name,
    file: encodeFileContent(content),
  })
  return res.data.file_id
}

export async function saveFile(
  fileId: number,
  name: string,
  content: string,
): Promise<{ fileId: number; created: boolean; updated: boolean }> {
  const res = await http.put<{ updated?: boolean; created?: boolean; file_id: number }>('/files', {
    file_id: fileId,
    name,
    file: encodeFileContent(content),
  })
  return {
    fileId: res.data.file_id,
    created: Boolean(res.data.created),
    updated: Boolean(res.data.updated),
  }
}

export async function renameFile(fileId: number, name: string): Promise<boolean> {
  await http.patch('/files', { file_id: fileId, name })
  return true
}

export async function deleteFile(fileId: number): Promise<boolean> {
  await http.delete('/files', { data: { file_id: fileId } })
  return true
}

