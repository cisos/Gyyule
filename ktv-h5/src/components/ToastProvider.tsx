import { useCallback, useMemo, useState } from 'react'
import { ToastCtx, type ToastType } from './toast'
import styles from './ToastProvider.module.css'

type ToastItem = { id: string; text: string; type: ToastType }

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])

  const show = useCallback((text: string, type: ToastType = 'info') => {
    const id = `${Date.now()}_${Math.random().toString(16).slice(2)}`
    const item: ToastItem = { id, text, type }
    setItems((prev) => [...prev, item].slice(-3))
    window.setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id))
    }, 1800)
  }, [])

  const value = useMemo(() => ({ show }), [show])

  return (
    <ToastCtx.Provider value={value}>
      {children}
      <div className={styles.wrap} aria-live="polite" aria-relevant="additions">
        {items.map((t) => (
          <div key={t.id} className={`${styles.toast} ${styles[t.type]}`}>
            {t.text}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

