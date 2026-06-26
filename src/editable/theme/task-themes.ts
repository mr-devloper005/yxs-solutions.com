import type { CSSProperties } from 'react'
import type { TaskKey } from '@/lib/site-config'

export type TaskTheme = {
  kicker: string
  note: string
  dark: boolean
  fontDisplay: string
  fontBody: string
  bg: string
  surface: string
  raised: string
  text: string
  muted: string
  line: string
  accent: string
  accentSoft: string
  onAccent: string
  glow: string
  radius: string
}

const DISPLAY_FONT = "'Chakra Petch', 'Arial Black', sans-serif"
const BODY_FONT = "'Archivo', system-ui, sans-serif"

const base = {
  dark: false,
  fontDisplay: DISPLAY_FONT,
  fontBody: BODY_FONT,
  bg: '#f7f7f5',
  surface: '#ffffff',
  raised: '#f6f6f6',
  text: '#171717',
  muted: '#5a5a5a',
  line: '#d8d8d8',
  accent: '#03AED2',
  accentSoft: '#F8DE22',
  onAccent: '#ffffff',
  glow: 'rgba(3, 174, 210, 0.16)',
  radius: '0px',
} satisfies Omit<TaskTheme, 'kicker' | 'note'>

export const taskThemes: Record<TaskKey, TaskTheme> = {
  article: { ...base, kicker: 'Funny galleries', note: 'Big list stories and image-led features.' },
  listing: { ...base, kicker: 'Games', note: 'Quick browse boards with strong visuals and clean details.' },
  classified: { ...base, kicker: 'Time wasters', note: 'Fast scan posts with direct action lanes.' },
  image: { ...base, kicker: 'Funny videos', note: 'Media-first layouts for visual browsing.' },
  sbm: { ...base, kicker: 'Internet classics', note: 'Saved pages and useful favorites in one shelf.' },
  pdf: { ...base, kicker: 'Downloads', note: 'File picks and useful reads in a bright archive.' },
  profile: { ...base, kicker: 'People', note: 'Identity-first profile cards with bold visuals.' },
}

export function getTaskTheme(task: TaskKey): TaskTheme {
  return taskThemes[task] || taskThemes.article
}

export function taskThemeStyle(task: TaskKey): CSSProperties {
  const t = getTaskTheme(task)
  return {
    '--tk-bg': t.bg,
    '--tk-surface': t.surface,
    '--tk-raised': t.raised,
    '--tk-text': t.text,
    '--tk-muted': t.muted,
    '--tk-line': t.line,
    '--tk-accent': t.accent,
    '--tk-accent-soft': t.accentSoft,
    '--tk-on-accent': t.onAccent,
    '--tk-glow': t.glow,
    '--tk-radius': t.radius,
    '--slot4-accent': t.accent,
    '--slot4-accent-fill': t.accent,
    '--editable-font-display': t.fontDisplay,
    '--editable-font-body': t.fontBody,
    fontFamily: t.fontBody,
  } as CSSProperties
}
