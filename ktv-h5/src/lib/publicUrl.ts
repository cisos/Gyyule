/**
 * Resolves a path served from `public/` for non-root `base` (e.g. GitHub Pages).
 */
export function publicUrl(path: string): string {
  const trimmed = path.replace(/^\/+/, '')
  return `${import.meta.env.BASE_URL}${trimmed}`
}
