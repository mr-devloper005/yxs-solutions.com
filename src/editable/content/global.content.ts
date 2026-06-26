import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const globalContent = {
  site: {
    name: slot4BrandConfig.siteName,
    tagline: slot4BrandConfig.tagline || 'Fresh internet finds and visual stories',
    domain: slot4BrandConfig.domain,
    baseUrl: slot4BrandConfig.baseUrl,
  },
  nav: {
    tagline: 'Fresh internet finds and visual stories',
    primaryLinks: [
      { label: 'Funny Galleries', href: '/article' },
      { label: 'Funny Videos', href: '/image' },
      { label: 'Games', href: '/listing' },
      { label: 'Time Wasters', href: '/classified' },
      { label: 'Internet Classics', href: '/sbm' },
    ],
    actions: {
      primary: { label: 'Start exploring', href: '/' },
      secondary: { label: 'Submit', href: '/contact' },
    },
  },
  footer: {
    tagline: 'Fresh picks, visual posts, and scrollable rabbit holes',
    description: 'Browse standout posts, image-led stories, curious lists, and useful links in one playful editorial portal.',
    columns: [
      {
        title: 'Browse',
        links: [
          { label: 'Funny Galleries', href: '/article' },
          { label: 'Funny Videos', href: '/image' },
          { label: 'Games', href: '/listing' },
          { label: 'Time Wasters', href: '/classified' },
        ],
      },
      {
        title: 'More',
        links: [
          { label: 'Internet Classics', href: '/sbm' },
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
        ],
      },
    ],
    bottomNote: 'Built for playful browsing and easy discovery.',
  },
  commonLabels: {
    readMore: 'Read more',
    viewAll: 'View all',
    explore: 'Explore',
    latest: 'Latest',
    related: 'Related',
    published: 'Published',
  },
} as const
