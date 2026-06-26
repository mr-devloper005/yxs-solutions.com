import type { TaskKey } from '@/lib/site-config'

export type TaskPageVoice = {
  eyebrow: string
  headline: string
  description: string
  filterLabel: string
  secondaryNote: string
  chips: string[]
}

export const taskPageVoices = {
  article: {
    eyebrow: 'Funny galleries',
    headline: 'Scrollable list stories and image-heavy reads.',
    description: 'This archive should feel like an editorial feed with large features, stacked picks, and quick-hit browsing.',
    filterLabel: 'Choose story topic',
    secondaryNote: 'Lead with images and sharp headlines before longer summaries.',
    chips: ['Feature picks', 'Quick reads', 'Editorial stack'],
  },
  classified: {
    eyebrow: 'Time wasters',
    headline: 'Quick posts built for fast scanning and easy clicks.',
    description: 'Keep this section light, lively, and practical with clear labels, easy summaries, and direct action cues.',
    filterLabel: 'Filter post category',
    secondaryNote: 'Prioritize compact cards and bold badges over long introductions.',
    chips: ['Fast scan', 'Quick picks', 'Browse now'],
  },
  sbm: {
    eyebrow: 'Internet classics',
    headline: 'Curated links and saved pages arranged like favorites.',
    description: 'Bookmark pages should feel like a shelf of reusable discoveries with clear titles and easy outbound paths.',
    filterLabel: 'Filter collection',
    secondaryNote: 'Keep the layout calm enough to browse but playful enough to match the rest of the site.',
    chips: ['Saved links', 'Useful finds', 'Collections'],
  },
  profile: {
    eyebrow: 'Featured people',
    headline: 'Profiles with personality, visuals, and easy scan cues.',
    description: 'Profile pages should make people and brands feel visible at a glance with identity-forward cards and clean metadata.',
    filterLabel: 'Filter profile category',
    secondaryNote: 'Make the name and image carry the first impression.',
    chips: ['Identity first', 'Visual profiles', 'Easy browse'],
  },
  pdf: {
    eyebrow: 'Downloads',
    headline: 'Documents and files presented as useful picks.',
    description: 'Document pages should read like a browsable library with file cues, summaries, and clear action buttons.',
    filterLabel: 'Filter document type',
    secondaryNote: 'Make the archive feel useful before it feels technical.',
    chips: ['Downloadable', 'Reference picks', 'File library'],
  },
  listing: {
    eyebrow: 'Games',
    headline: 'Directory-style posts with bright cards and quick details.',
    description: 'Listing pages should feel like a browseable board with strong imagery, short metadata lines, and easy next-click paths.',
    filterLabel: 'Filter listing category',
    secondaryNote: 'Use side-by-side card mixes so the page never feels too uniform.',
    chips: ['Directory board', 'Quick details', 'Browse grid'],
  },
  image: {
    eyebrow: 'Funny videos',
    headline: 'Visual posts with a gallery-first browsing rhythm.',
    description: 'Image pages should put strong media first, then support it with punchy headlines and compact text.',
    filterLabel: 'Filter visual category',
    secondaryNote: 'Let the archive feel like a scrolling wall of discoveries.',
    chips: ['Gallery wall', 'Image-first', 'Visual picks'],
  },
} satisfies Record<TaskKey, TaskPageVoice>
