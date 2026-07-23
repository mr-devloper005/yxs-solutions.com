import Link from 'next/link'
import { ArrowRight, ChevronDown, FileText, Globe, MapPin, Phone, Search } from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts, buildPostUrl } from '@/lib/task-data'
import { getTaskConfig, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { taskThemeStyle } from '@/editable/theme/task-themes'

export const revalidate = 3

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)
const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const image = asText(content.image) || asText(content.featuredImage) || asText(content.thumbnail) || asText(content.logo)
  return [...media, ...images, ...(isUrl(image) ? [image] : [])].filter(Boolean).slice(0, 8)
}

const placeholder = '/placeholder.svg?height=900&width=1200'
const getImage = (post: SitePost) => getImages(post)[0] || placeholder
const getCategory = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const getSummary = (post: SitePost) => {
  const raw = post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || asText(getContent(post).body)
  const clean = stripHtml(raw)
  return clean || 'Fresh picks and browseable discoveries from this section.'
}
const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

function pageHref(basePath: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

export async function EditableTaskArchiveRoute({
  task,
  searchParams,
  basePath,
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)
  const { posts, pagination } = await fetchPaginatedTaskPosts(task, { page, limit: 24, category })
  return <TaskArchiveView task={task} posts={posts} pagination={pagination} category={category} basePath={basePath || taskConfig?.route || `/${task}`} />
}

export function TaskArchiveView({ task, posts, pagination, category, basePath }: { task: TaskKey; posts: SitePost[]; pagination: SiteFeedPagination; category: string; basePath: string }) {
  const taskConfig = getTaskConfig(task)
  const voice = taskPageVoices[task]
  const page = pagination.page || 1
  const label = taskConfig?.label || task

  return (
    <EditableSiteShell>
      <main style={taskThemeStyle(task)} className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]">
        <div className="mx-auto max-w-[var(--editable-container)] bg-white">
          <header className="border-b border-[var(--tk-line)] px-4 py-8 sm:px-6 lg:px-8">
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#D12052]">{voice.eyebrow}</p>
                <h1 className="editable-display mt-3 text-[2.8rem] font-black uppercase leading-[0.92] tracking-[-0.05em] text-[var(--tk-accent)] sm:text-[3.6rem]">
                  {voice.headline}
                </h1>
                <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--tk-text)]">{voice.description}</p>
              </div>
              <div className="border border-[var(--tk-line)] bg-[#F8DE22] p-5 text-[#D12052]">
                <p className="editable-display text-[2rem] font-black uppercase leading-none tracking-[-0.05em]">Browse board</p>
                <p className="mt-3 text-sm leading-6">Fresh cards, compact lists, and image-led picks arranged for quick scanning.</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {voice.chips.map((chip) => (
                    <span key={chip} className="bg-white px-3 py-2 text-[11px] font-black uppercase tracking-[0.14em] text-[var(--tk-accent)]">
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-7 flex flex-col gap-4 border-t border-[var(--tk-line)] pt-5 lg:flex-row lg:items-center lg:justify-between">
              <p className="text-sm font-semibold text-[var(--tk-muted)]">
                {posts.length} {posts.length === 1 ? 'post' : 'posts'} in {category === 'all' ? label : CATEGORY_OPTIONS.find((item) => item.slug === category)?.name || category}
              </p>
              <form action={basePath} className="flex flex-wrap items-center gap-3">
                <label className="relative">
                  <select
                    name="category"
                    defaultValue={category}
                    className="h-11 appearance-none border border-[var(--tk-line)] bg-white pl-4 pr-10 text-sm font-semibold text-[var(--tk-text)] outline-none"
                    aria-label={voice.filterLabel}
                  >
                    <option value="all">All categories</option>
                    {CATEGORY_OPTIONS.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--tk-muted)]" />
                </label>
                <button className="h-11 bg-[var(--tk-accent)] px-5 text-sm font-black uppercase tracking-[0.14em] text-white">Apply</button>
              </form>
            </div>
          </header>

          <section className="px-4 py-8 sm:px-6 lg:px-8">
            {posts.length ? (
              <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-6">
                  {posts.slice(0, 12).map((post, index) => (
                    <EditorialArchiveCard key={post.id || post.slug || `${index}`} post={post} href={`${basePath}/${post.slug}` || buildPostUrl(task, post.slug)} index={index} task={task} />
                  ))}
                </div>
                <div className="space-y-6">
                  <div className="bg-[#F45B26] px-4 py-3 text-white">
                    <h2 className="editable-display text-[2rem] font-black uppercase leading-none tracking-[-0.05em]">More picks</h2>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
                    {posts.slice(12, 24).map((post, index) => (
                      <MixedArchiveCard key={post.id || post.slug || `${index + 20}`} post={post} href={`${basePath}/${post.slug}` || buildPostUrl(task, post.slug)} task={task} index={index} />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="border border-dashed border-[var(--tk-line)] bg-[#f8f8f8] px-8 py-16 text-center">
                <Search className="mx-auto h-7 w-7 text-[var(--tk-accent)]" />
                <h2 className="editable-display mt-4 text-[2rem] font-black uppercase leading-none tracking-[-0.05em] text-[var(--tk-accent)]">Nothing here yet</h2>
                <p className="mt-3 text-sm leading-6 text-[var(--tk-muted)]">Try another category or come back after fresh posts are published.</p>
              </div>
            )}

            {posts.length ? (
              <nav className="mt-10 flex flex-wrap items-center justify-center gap-3 text-sm">
                {pagination.hasPrevPage ? <Link href={pageHref(basePath, category, page - 1)} className="border border-[var(--tk-line)] px-5 py-3 font-black uppercase tracking-[0.12em] text-[var(--tk-accent)]">Previous</Link> : null}
                <span className="bg-[#F8DE22] px-5 py-3 font-black uppercase tracking-[0.12em] text-[#D12052]">Page {page} of {pagination.totalPages || 1}</span>
                {pagination.hasNextPage ? <Link href={pageHref(basePath, category, page + 1)} className="border border-[var(--tk-line)] px-5 py-3 font-black uppercase tracking-[0.12em] text-[var(--tk-accent)]">Next</Link> : null}
              </nav>
            ) : null}
          </section>
        </div>
      </main>
    </EditableSiteShell>
  )
}

function EditorialArchiveCard({ post, href, index, task }: { post: SitePost; href: string; index: number; task: TaskKey }) {
  return (
    <article className="grid gap-4 border-b border-[var(--tk-line)] pb-6 last:border-b-0 sm:grid-cols-[280px_minmax(0,1fr)]">
      <Link href={href} className="group block overflow-hidden border border-[var(--tk-line)] bg-[var(--tk-raised)]">
        <img src={getImage(post)} alt={post.title} className="aspect-[16/11] h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
      </Link>
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-black uppercase tracking-[0.16em] text-[#D12052]">{getCategory(post, task)}</span>
          <span className="text-[11px] font-black uppercase tracking-[0.16em] text-[var(--tk-muted)]">No. {String(index + 1).padStart(2, '0')}</span>
        </div>
        <Link href={href} className="editable-display mt-2 block text-[2rem] font-black uppercase leading-[0.94] tracking-[-0.05em] text-[var(--tk-accent)] hover:opacity-85">
          {post.title}
        </Link>
        <p className="mt-2 text-base leading-6 text-[var(--tk-text)]">{getSummary(post)}</p>
        <div className="mt-3 flex flex-wrap gap-4 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--tk-muted)]">
          {getField(post, ['location', 'address', 'city']) ? <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> {getField(post, ['location', 'address', 'city'])}</span> : null}
          {getField(post, ['phone', 'telephone', 'mobile']) ? <span className="inline-flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> {getField(post, ['phone', 'telephone', 'mobile'])}</span> : null}
        </div>
      </div>
    </article>
  )
}

function MixedArchiveCard({ post, href, task, index }: { post: SitePost; href: string; task: TaskKey; index: number }) {
  if (task === 'listing') {
    return (
      <Link href={href} className="flex gap-4 border border-[var(--tk-line)] bg-white p-4">
        <img src={getImage(post)} alt={post.title} className="h-24 w-24 shrink-0 object-cover" />
        <div className="min-w-0">
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#D12052]">{getCategory(post, 'Listing')}</p>
          <h3 className="editable-display mt-2 text-[1.5rem] font-black uppercase leading-[0.95] tracking-[-0.05em] text-[var(--tk-accent)]">{post.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--tk-text)]">{getSummary(post)}</p>
          <div className="mt-2 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--tk-muted)]">
            {getField(post, ['location', 'address', 'city']) ? <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> {getField(post, ['location', 'address', 'city'])}</span> : null}
            {getField(post, ['website', 'url']) ? <span className="inline-flex items-center gap-1.5"><Globe className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> Visit</span> : null}
          </div>
        </div>
      </Link>
    )
  }

  if (task === 'sbm' || task === 'pdf') {
    return (
      <Link href={href} className="border border-[var(--tk-line)] bg-[#fff8d9] p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center bg-[var(--tk-accent)] text-white">
            {task === 'sbm' ? <Globe className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
          </span>
          <span className="text-[11px] font-black uppercase tracking-[0.16em] text-[#D12052]">{getCategory(post, task)}</span>
        </div>
        <h3 className="editable-display mt-3 text-[1.6rem] font-black uppercase leading-[0.95] tracking-[-0.05em] text-[var(--tk-accent)]">{post.title}</h3>
        <p className="mt-2 text-sm leading-6 text-[var(--tk-text)]">{getSummary(post)}</p>
      </Link>
    )
  }

  return (
    <Link href={href} className="overflow-hidden border border-[var(--tk-line)] bg-white">
      <img src={getImage(post)} alt={post.title} className={`w-full object-cover ${index % 2 === 0 ? 'aspect-[4/3]' : 'aspect-[16/10]'}`} />
      <div className="p-4">
        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#D12052]">{getCategory(post, task)}</p>
        <h3 className="editable-display mt-2 text-[1.55rem] font-black uppercase leading-[0.95] tracking-[-0.05em] text-[var(--tk-accent)]">{post.title}</h3>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-[var(--tk-text)]">{getSummary(post)}</p>
        <span className="mt-3 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-[var(--tk-accent)]">
          Open post <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  )
}
