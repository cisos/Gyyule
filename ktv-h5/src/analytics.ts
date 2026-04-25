export type AnalyticsEvent = {
  name: string
  payload?: Record<string, unknown>
  ts: number
}

const STORAGE_KEY = '__ktv_h5_events_v1'

export function track(name: string, payload?: Record<string, unknown>) {
  const evt: AnalyticsEvent = { name, payload, ts: Date.now() }
  try {
    const prev = localStorage.getItem(STORAGE_KEY)
    const arr: AnalyticsEvent[] = prev ? JSON.parse(prev) : []
    arr.push(evt)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr.slice(-200)))
  } catch {
    // ignore storage errors
  }
  try {
    // helpful during development
    console.log('[track]', evt)
  } catch {
    // ignore
  }
}

