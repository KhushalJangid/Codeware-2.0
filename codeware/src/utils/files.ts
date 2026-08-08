import type { FileType, RunnerLang } from '../types'

export function fileTypeFromName(name: string): FileType {
  const ext = name.split('.').pop()?.toLowerCase()
  switch (ext) {
    case 'py':
      return 'python'
    case 'java':
      return 'java'
    case 'js':
      return 'javascript'
    case 'go':
      return 'go'
    case 'dart':
      return 'dart'
    case 'c':
      return 'c'
    case 'cpp':
      return 'cpp'
    default:
      return 'python'
  }
}

export function runnerLangFromFileType(t: FileType): RunnerLang {
  switch (t) {
    case 'python':
      return 'py'
    case 'java':
      return 'java'
    case 'javascript':
      return 'js'
    case 'go':
      return 'go'
    case 'dart':
      return 'dart'
    case 'c':
      return 'c'
    case 'cpp':
      return 'cpp'
  }
}

export function boilerplate(fileType: FileType, fileName: string): string {
  const base = fileName.split('.').slice(0, -1).join('.') || 'Main'
  switch (fileType) {
    case 'python':
      return `print("hello world")\n`
    case 'javascript':
      return `console.log("hello world")\n`
    case 'go':
      return `package main\n\nimport "fmt"\n\nfunc main() {\n\tfmt.Println("Hello World")\n}\n`
    case 'dart':
      return `void main() {\n\tprint("Hello World");\n}\n`
    case 'c':
      return `#include <stdio.h>\n\nint main() {\n\tprintf("Hello World!");\n\treturn 0;\n}\n`
    case 'cpp':
      return `#include <iostream>\nusing namespace std;\n\nint main() {\n\tcout << "Hello World!";\n\treturn 0;\n}\n`
    case 'java':
      return `public class ${safeJavaClassName(base)} {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello World!");\n\t}\n}\n`
  }
}

export function safeJavaClassName(name: string): string {
  const cleaned = name.replace(/[^A-Za-z0-9_]/g, '')
  const capped = cleaned.length ? cleaned[0]!.toUpperCase() + cleaned.slice(1) : 'Main'
  return /^[A-Za-z_]/.test(capped) ? capped : `Main${capped}`
}

export function encodeFileContent(content: string): number[] {
  return Array.from(new TextEncoder().encode(content))
}

export function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

