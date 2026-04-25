import { createContext, useContext } from 'react'

export type ToastType = 'success' | 'error' | 'info'

export const ToastCtx = createContext<{ show: (text: string, type?: ToastType) => void } | null>(null)

export function useToast() {
  const ctx = useContext(ToastCtx)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

