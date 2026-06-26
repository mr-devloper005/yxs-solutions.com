import Link from 'next/link'
import { ArrowRight, Flame } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { getEditablePostImage, postHref } from '@/editable/cards/PostCards'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

const container = 'mx-auto w-full max-w-[var(--editable-container)] px-4 sm:px-6 lg:px-8'

function dedupePosts(posts: SitePost[]) {
  const seen = new Set<string>()
  const out: SitePost[] = []
  for (const post of posts) {
    const key = post.slug || post.id || post.title
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(post)
  }
  return out
}

function excerptOf(post?: SitePost | null, limit = 120) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    post?.summary ||
    ''
  const clean = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  if (!clean) return 'Fresh picks, playful discoveries, and image-led posts from across the site.'
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

function categoryOf(post?: SitePost | null, fallback = 'Featured') {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || fallback
}

function splitFeed(posts: SitePost[]) {
  const safe = dedupePosts(posts)
  return {
    hero: safe[0],
    sideLead: safe.slice(1, 3),
    popular: safe.slice(3, 7),
    lower: safe.slice(7, 11),
    compact: safe.slice(11, 17),
    imageWall: safe.slice(17, 23),
  }
}

function SectionBar({ title, accent = 'yellow' }: { title: string; accent?: 'yellow' | 'green' }) {
  return (
    <div className={`px-4 py-3 ${accent === 'yellow' ? 'bg-[#F8DE22] text-[#D12052]' : 'bg-[#F45B26] text-white'}`}>
      <h2 className="editable-display text-[2rem] font-black uppercase leading-none tracking-[-0.05em] sm:text-[2.5rem]">{title}</h2>
    </div>
  )
}

function MetaLine({ post, categoryFallback = 'Featured' }: { post: SitePost; categoryFallback?: string }) {
  return (
    <div className="mt-3 text-sm leading-5 text-[var(--slot4-page-text)]">
      <span className="font-semibold text-[var(--slot4-accent)]">{SITE_CONFIG.name}</span>
      <span className="mx-1 text-[var(--slot4-muted-text)]">in</span>
      <span className="font-semibold text-[#D12052]">{categoryOf(post, categoryFallback)}</span>
    </div>
  )
}

function FeatureLead({ post, href }: { post: SitePost; href: string }) {
  return (
    <article className="border border-[var(--editable-border)] bg-white p-5 sm:p-6">
      <Link href={href} className="group block">
        <div className="overflow-hidden border border-[var(--editable-border)] bg-[var(--slot4-media-bg)]">
          <img src={getEditablePostImage(post)} alt={post.title} className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
        </div>
        <h2 className="editable-display mt-5 max-w-[11ch] text-[2.2rem] font-black leading-[0.92] tracking-[-0.07em] text-[var(--slot4-accent)] sm:text-[2.7rem] lg:text-[3rem]">
          {post.title}
        </h2>
      </Link>
      <p className="mt-3 max-w-2xl text-[1.02rem] leading-7 text-[var(--slot4-page-text)]">{excerptOf(post, 180)}</p>
      <MetaLine post={post} />
    </article>
  )
}

function CompactStory({ post, href }: { post: SitePost; href: string }) {
  return (
    <article className="overflow-hidden border border-[var(--editable-border)] bg-white">
      <Link href={href} className="group block overflow-hidden border-b border-[var(--editable-border)] bg-[var(--slot4-media-bg)]">
        <img src={getEditablePostImage(post)} alt={post.title} className="aspect-[16/11] h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
      </Link>
      <div className="p-4">
        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#D12052]">{categoryOf(post)}</p>
        <Link href={href} className="editable-display mt-2 block text-[1.55rem] font-black leading-[0.95] tracking-[-0.05em] text-[var(--slot4-accent)] hover:opacity-85">
          {post.title}
        </Link>
        <p className="mt-2 text-sm leading-6 text-[var(--slot4-page-text)]">{excerptOf(post, 88)}</p>
        <MetaLine post={post} />
      </div>
    </article>
  )
}

function PopularCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <article className="grid grid-cols-[1fr_96px] items-center gap-3 border-t border-[#d8c81a] pt-4 first:border-t-0 first:pt-0">
      <div>
        <Link href={href} className="editable-display block text-[1.45rem] font-black leading-[0.94] tracking-[-0.05em] text-[var(--slot4-accent)] hover:opacity-85">
          {post.title}
        </Link>
      </div>
      <Link href={href} className="group block overflow-hidden border border-[#F8DE22] bg-white">
        <img src={getEditablePostImage(post)} alt={post.title} className="aspect-square h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
      </Link>
    </article>
  )
}

function HorizontalFeature({ post, href }: { post: SitePost; href: string }) {
  return (
    <article className="grid gap-4 border-t border-[#03AED2] pt-6 sm:grid-cols-[1.1fr_0.9fr] sm:items-start">
      <Link href={href} className="group block overflow-hidden border border-[var(--editable-border)] bg-[var(--slot4-media-bg)]">
        <img src={getEditablePostImage(post)} alt={post.title} className="aspect-[16/10] h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
      </Link>
      <div>
        <Link href={href} className="editable-display block text-[2.2rem] font-black leading-[0.94] tracking-[-0.05em] text-[var(--slot4-accent)] hover:opacity-85">
          {post.title}
        </Link>
        <p className="mt-2 text-base leading-6 text-[var(--slot4-page-text)]">{excerptOf(post, 110)}</p>
        <MetaLine post={post} />
      </div>
    </article>
  )
}

function EditorialListItem({ post, href }: { post: SitePost; href: string }) {
  return (
    <article className="grid gap-4 border-b border-[#03AED2] pb-6 last:border-b-0 last:pb-0 sm:grid-cols-[280px_minmax(0,1fr)]">
      <Link href={href} className="group block overflow-hidden border border-[var(--editable-border)] bg-[var(--slot4-media-bg)]">
        <img src={getEditablePostImage(post)} alt={post.title} className="aspect-[16/11] h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
      </Link>
      <div>
        <Link href={href} className="editable-display block text-[2.1rem] font-black leading-[0.96] tracking-[-0.05em] text-[var(--slot4-accent)] hover:opacity-85">
          {post.title}
        </Link>
        <p className="mt-2 text-base leading-6 text-[var(--slot4-page-text)]">{excerptOf(post, 130)}</p>
        <MetaLine post={post} />
      </div>
    </article>
  )
}

function ImageFirstCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <article className="overflow-hidden border border-[var(--editable-border)] bg-white">
      <Link href={href} className="group block">
        <img src={getEditablePostImage(post)} alt={post.title} className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
      </Link>
      <div className="p-4">
        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#D12052]">{categoryOf(post)}</p>
        <Link href={href} className="editable-display mt-2 block text-[1.6rem] font-black leading-[0.95] tracking-[-0.05em] text-[var(--slot4-accent)] hover:opacity-85">
          {post.title}
        </Link>
        <p className="mt-2 text-sm leading-6 text-[var(--slot4-page-text)]">{excerptOf(post, 88)}</p>
      </div>
    </article>
  )
}

export function EditableHomeHero({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)])
  const { hero, sideLead, popular } = splitFeed(pool)

  if (!hero) return null

  return (
    <section className="py-6">
      <div className={`${container} editable-portal-shell`}>
        <div className="grid gap-6 px-4 py-6 lg:grid-cols-[minmax(0,1.35fr)_320px] lg:px-5">
          <div className="min-w-0">
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_280px]">
              <div className="min-w-0">
                <FeatureLead post={hero} href={postHref(primaryTask, hero, primaryRoute)} />
              </div>
              <div className="space-y-5">
                {sideLead.map((post) => (
                  <CompactStory key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} />
                ))}
              </div>
            </div>
          </div>

          <aside className="self-start bg-[#F8DE22] p-4">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--slot4-accent)] text-white">
                <Flame className="h-5 w-5" />
              </span>
              <h2 className="editable-display text-[2.2rem] font-black uppercase leading-[0.92] tracking-[-0.05em] text-[#D12052]">
                Most Popular
              </h2>
            </div>
            <div className="mt-5 space-y-4">
              {popular.map((post) => (
                <PopularCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} />
              ))}
            </div>
          </aside>
        </div>

      </div>
    </section>
  )
}

export function EditableStoryRail({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)]).slice(0, 4)
  if (!pool.length) return null

  return (
    <section className="pb-6">
      <div className={`${container} editable-portal-shell px-4 py-6 lg:px-5`}>
        <SectionBar title="Games" accent="green" />
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.14fr_0.86fr]">
          <div className="min-h-[280px] bg-[#F45B26] p-4 text-white">
            <p className="max-w-xl text-sm leading-6 text-white/90">
              Browse playful directory-style posts, image-first finds, and compact highlights arranged like a bright portal board.
            </p>
          </div>
          <div className="space-y-5">
            {pool.slice(0, 2).map((post) => (
              <HorizontalFeature key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)])
  const features = pool.slice(4, 8)
  const side = pool.slice(8, 11)
  if (!features.length) return null

  return (
    <section className="pb-6">
      <div className={`${container} editable-portal-shell px-4 py-6 lg:px-5`}>
        <div className="grid gap-6 lg:grid-cols-[1.12fr_0.88fr]">
          <div className="space-y-6">
            {features.map((post) => (
              <EditorialListItem key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} />
            ))}
          </div>

          <aside className="space-y-6">
            <div className="border border-[var(--editable-border)] bg-[var(--slot4-accent)] p-4">
              <h3 className="editable-display text-[2rem] font-black uppercase leading-none tracking-[-0.05em] text-white">
                Endless Soundboards
              </h3>
              {side[0] ? (
                <Link href={postHref(primaryTask, side[0], primaryRoute)} className="mt-4 block border border-white/20 bg-white p-3">
                  <img src={getEditablePostImage(side[0])} alt={side[0].title} className="aspect-[16/10] w-full object-cover" />
                  <p className="mt-3 text-center text-base font-black text-[#F8DE22]">Click here for more picks</p>
                </Link>
              ) : null}
            </div>
            <div className="editable-blue-rule pt-6">
              {side.slice(1).map((post) => (
                <div key={post.id || post.slug} className="mb-6 last:mb-0">
                  <Link href={postHref(primaryTask, post, primaryRoute)} className="editable-display block text-[1.9rem] font-black leading-[0.96] tracking-[-0.05em] text-[var(--slot4-accent)] hover:opacity-85">
                    {post.title}
                  </Link>
                  <p className="mt-2 text-base leading-6 text-[var(--slot4-page-text)]">{excerptOf(post, 90)}</p>
                  <MetaLine post={post} />
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)])
  const editorial = pool.slice(10, 14)
  const imageWall = pool.slice(14, 20)

  if (!editorial.length && !imageWall.length) return null

  return (
    <>
      {editorial.length ? (
        <section className="pb-6">
          <div className={`${container} editable-portal-shell px-4 py-6 lg:px-5`}>
            <div className="grid gap-6 lg:grid-cols-[1.12fr_0.88fr]">
              <div className="space-y-6">
                {editorial.map((post) => (
                  <EditorialListItem key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} />
                ))}
              </div>
              <aside className="space-y-4">
                <SectionBar title="Most Shared" />
                <div className="space-y-4">
                  {editorial.slice(0, 3).map((post) => (
                    <div key={post.id || post.slug} className="border border-[var(--editable-border)] bg-[#fff8d9] p-4">
                      <Link href={postHref(primaryTask, post, primaryRoute)} className="editable-display block text-[1.7rem] font-black leading-[0.96] tracking-[-0.05em] text-[var(--slot4-accent)] hover:opacity-85">
                        {post.title}
                      </Link>
                      <p className="mt-2 text-sm leading-6 text-[var(--slot4-page-text)]">{excerptOf(post, 70)}</p>
                    </div>
                  ))}
                </div>
              </aside>
            </div>
          </div>
        </section>
      ) : null}

      {imageWall.length ? (
        <section className="pb-6">
          <div className={`${container} editable-portal-shell px-4 py-6 lg:px-5`}>
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#D12052]">Visual picks</p>
                <h2 className="editable-display text-[2.8rem] font-black uppercase leading-none tracking-[-0.05em] text-[var(--slot4-accent)]">
                  Image Wall
                </h2>
              </div>
              <Link href={primaryRoute} className="inline-flex items-center gap-2 bg-[var(--slot4-accent)] px-4 py-3 text-sm font-black uppercase tracking-[0.14em] text-white">
                See all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {imageWall.map((post, index) => (
                <ImageFirstCard key={`${post.id || post.slug}-${index}`} post={post} href={postHref(primaryTask, post, primaryRoute)} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  )
}

export function EditableHomeCta() {
  return (
    <section className="pb-10">
      <div className={`${container} editable-portal-shell border border-[var(--editable-border)] bg-[var(--slot4-accent)] px-5 py-8 text-white`}>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#F8DE22]">{pagesContent.home.cta.badge}</p>
            <h2 className="editable-display mt-3 text-[2.5rem] font-black uppercase leading-[0.92] tracking-[-0.05em]">
              {pagesContent.home.cta.title}
            </h2>
            <p className="mt-3 text-base leading-7 text-white/88">{pagesContent.home.cta.description}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href={pagesContent.home.cta.primaryCta.href} className="bg-[#F8DE22] px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-[#D12052]">
              {pagesContent.home.cta.primaryCta.label}
            </Link>
            <Link href={pagesContent.home.cta.secondaryCta.href} className="border border-white/25 px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-white">
              {pagesContent.home.cta.secondaryCta.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
