import { WS_BASE_URL } from '../config'
import type { RunnerLang } from '../types'

export type CompilerMessage = {
  output: string
  status: number
}

export class CompilerClient {
  private ws: WebSocket | null = null
  private onMessage: ((m: CompilerMessage) => void) | null = null
  private onClose: (() => void) | null = null
  private onOpen: (() => void) | null = null
  private onError: ((e: Event) => void) | null = null

  connect(opts: {
    onMessage: (m: CompilerMessage) => void
    onClose?: () => void
    onOpen?: () => void
    onError?: (e: Event) => void
  }) {
    this.onMessage = opts.onMessage
    this.onClose = opts.onClose ?? null
    this.onOpen = opts.onOpen ?? null
    this.onError = opts.onError ?? null

    const url = `${WS_BASE_URL}/ws/iostream`
    this.ws = new WebSocket(url)

    this.ws.onopen = () => this.onOpen?.()
    this.ws.onclose = () => this.onClose?.()
    this.ws.onerror = (e) => this.onError?.(e)
    this.ws.onmessage = (evt) => {
      try {
        const data = JSON.parse(evt.data) as CompilerMessage
        this.onMessage?.(data)
      } catch {
        this.onMessage?.({ output: String(evt.data), status: 200 })
      }
    }
  }

  close() {
    try {
      this.ws?.close()
    } catch {
      // ignore
    } finally {
      this.ws = null
    }
  }

  sendCode(lang: RunnerLang, code: string) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return
    this.ws.send(JSON.stringify({ lang, code }))
  }

  sendInput(input: string) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return
    this.ws.send(JSON.stringify({ input }))
  }
}

