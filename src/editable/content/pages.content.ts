import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const pagesContent = {
  home: {
    metadata: {
      title: 'Funny galleries, visual stories, and internet finds',
      description: 'Explore image-led posts, list stories, and playful discoveries in a bright editorial portal.',
      openGraphTitle: 'Funny galleries, visual stories, and internet finds',
      openGraphDescription: 'Browse image-led stories, curious lists, and scrollable discoveries in one playful portal.',
      keywords: ['funny galleries', 'visual stories', 'internet finds', 'viral lists'],
    },
    hero: {
      badge: 'Daily picks',
      title: ['Fresh galleries, visual stories,', 'and scrollable finds.'],
      description: 'A playful place for bold images, quick reads, curious lists, and the kind of links that keep a break going a little longer.',
      primaryCta: { label: 'Read latest stories', href: '/article' },
      secondaryCta: { label: 'Explore visuals', href: '/image' },
      searchPlaceholder: 'Search stories, galleries, lists, and more',
      focusLabel: 'Focus',
      featureCardBadge: 'editor pick',
      featureCardTitle: 'Latest posts drive the entire front page mix.',
      featureCardDescription: 'Real posts fill the homepage with a hand-arranged blend of feature stories, side picks, and popular rails.',
    },
    intro: {
      badge: 'About the portal',
      title: 'Built for image-first wandering and quick-hit reading.',
      paragraphs: [
        'This front page mixes larger feature stories with stacked side picks so browsing feels lively instead of repetitive.',
        'Images, lists, bookmarks, and directory-style posts stay connected through one visual system that makes each section easy to scan.',
        'Whether someone lands for a quick laugh or a longer rabbit hole, there is always another lane to keep exploring.',
      ],
      sideBadge: 'At a glance',
      sidePoints: [
        'Big feature storytelling with image-first post mixes.',
        'Dense side rails for quick browsing and repeat clicks.',
        'Section colors and labels that make scanning easy.',
        'Mobile layouts that keep the same playful rhythm.',
      ],
      primaryLink: { label: 'Browse articles', href: '/article' },
      secondaryLink: { label: 'See visuals', href: '/image' },
    },
    cta: {
      badge: 'Keep browsing',
      title: 'Find another favorite post before you leave.',
      description: 'Jump into galleries, lists, bookmarks, and browseable picks through one louder, more playful reading surface.',
      primaryCta: { label: 'Browse Articles', href: '/article' },
      secondaryCta: { label: 'Contact', href: '/contact' },
    },
    taskSection: {
      heading: 'Latest {label}',
      descriptionSuffix: 'Browse the newest posts in this section.',
    },
  },
  about: {
    badge: 'About',
    title: 'A playful browse-first home for stories, lists, and visuals.',
    description: `${slot4BrandConfig.siteName} brings together image-led posts, quick reads, and useful discoveries through one bright editorial portal.`,
    paragraphs: [
      'The goal is simple: make browsing feel lively, easy, and worth sticking around for.',
      'Stories, image posts, links, listings, and profiles all live inside the same visual rhythm so visitors can keep moving without friction.',
    ],
    values: [
      {
        title: 'Browseable by default',
        description: 'Layouts are built to encourage wandering, not just one-and-done reading.',
      },
      {
        title: 'Image-forward rhythm',
        description: 'Large visuals, stacked side picks, and compact lists keep the page feeling active.',
      },
      {
        title: 'Clean enough to trust',
        description: 'Even with a louder visual voice, the page stays readable, responsive, and easy to scan.',
      },
    ],
  },
  contact: {
    eyebrow: `Contact ${slot4BrandConfig.siteName}`,
    title: 'Questions, ideas, or partnership notes all land here.',
    description: 'Send a quick message about a post, listing, profile, or general request and we will route it to the right place.',
    formTitle: 'Send a message',
  },
  search: {
    metadata: {
      title: 'Search',
      description: 'Search posts, topics, categories, and content across the site.',
    },
    hero: {
      badge: 'Search the archive',
      title: 'Find stories, galleries, lists, and saved links fast.',
      description: 'Use keywords and categories to browse recent picks from every active section of the site.',
      placeholder: 'Search by keyword, title, or topic',
    },
    resultsTitle: 'Latest searchable content',
  },
  create: {
    metadata: {
      title: 'Create',
      description: 'Create and submit new content for the site.',
    },
    locked: {
      badge: 'Creator access',
      title: 'Login to create new content.',
      description: 'Use your account to open the publishing workspace and submit posts for the active sections of this site.',
    },
    hero: {
      badge: 'Publishing workspace',
      title: 'Create content for every active section.',
      description: 'Choose the format, add details, and prepare a clean post with images, links, summary, and body content.',
    },
    formTitle: 'Content details',
    submitLabel: 'Submit content',
    successTitle: 'Content submitted successfully.',
  },
  auth: {
    login: {
      metadataDescription: 'Login page for this site.',
      badge: 'Member access',
      title: 'Welcome back to your publishing space.',
      description: 'Login to continue browsing, managing submissions, and creating new content from your account.',
      formTitle: 'Login',
      submitLabel: 'Continue',
      noAccount: 'No account matched these details. Create an account first, then login.',
      success: 'Login successful. Redirecting...',
      createCta: 'Create an account',
    },
    signup: {
      metadataDescription: 'Signup page for this site.',
      badge: 'Site access',
      title: 'Create your account and start publishing.',
      description: 'Create an account to access the publishing workspace, save details, and submit content through the site.',
      formTitle: 'Create account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters for the password.',
      success: 'Account created successfully. Redirecting...',
      loginCta: 'Login',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'Related articles',
      fallbackTitle: 'Article details',
    },
    listing: {
      relatedTitle: 'Related listings',
      fallbackTitle: 'Listing details',
    },
    image: {
      relatedTitle: 'Related visuals',
      fallbackTitle: 'Image details',
    },
    profile: {
      relatedTitle: 'Suggested articles',
      fallbackDescription: 'Profile details will appear here once available.',
      visitButton: 'Visit Official Site',
    },
  },
} as const
