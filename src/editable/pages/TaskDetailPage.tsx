import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, ExternalLink, FileText, Globe2, Mail, MapPin, Phone, UserRound } from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableArticleComments } from '@/editable/components/EditableArticleComments'
import { taskThemeStyle } from '@/editable/theme/task-themes'

export const revalidate = 3

export async function generateEditableDetailMetadata(task: TaskKey, params: Promise<{ slug?: string; username?: string }>) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({ task, params }: { task: TaskKey; params: Promise<{ slug?: string; username?: string }> }) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  const related = (await fetchTaskPosts(task, 7)).filter((item) => item.slug !== post.slug).slice(0, 4)
  const comments = task === 'article' ? await fetchArticleComments(post.slug, 50) : []
  return <TaskDetailView task={task} post={post} related={related} comments={comments} />
}

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)
const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const single = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar'].map((key) => asText(content[key])).filter((url) => url && isUrl(url))
  return [...media, ...images, ...single].filter(Boolean).slice(0, 12)
}

const getBody = (post: SitePost) => {
  const content = getContent(post)
  return asText(content.body) || asText(content.description) || asText(content.details) || post.summary || 'Details will appear here once available.'
}

const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')

const safeUrl = (value: string) => /^https?:\/\//i.test(value) ? value : '#'
const linkifyText = (value: string) => value.replace(/(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi, (_m, prefix, url) => `${prefix}<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`)
const sanitizeHtml = (html: string) => html
  .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
  .replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  .replace(/(href|src)=(['"])javascript:[\s\S]*?\2/gi, '$1="#"')

const formatPlainText = (raw: string) => {
  const value = raw.trim()
  if (!value) return ''
  if (/<[a-z][\s\S]*>/i.test(value)) return sanitizeHtml(value)
  return value
    .split(/\n{2,}/)
    .map((part) => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`)
    .join('')
}

const summaryText = (post: SitePost) => stripHtml(post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || '')
const categoryOf = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback

export function TaskDetailView({ task, post, related, comments = [] }: { task: TaskKey; post: SitePost; related: SitePost[]; comments?: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  return (
    <EditableSiteShell>
      <main style={taskThemeStyle(task)} className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]">
        <div className="mx-auto max-w-[var(--editable-container)] bg-white px-4 py-8 sm:px-6 lg:px-8">
          <BackLink task={task} />
          <div className="mt-6 grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
            <article className="min-w-0">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#D12052]">{categoryOf(post, getTaskConfig(task)?.label || task)}</p>
              <h1 className="editable-display mt-3 text-[2.9rem] font-black uppercase leading-[0.92] tracking-[-0.05em] text-[var(--tk-accent)] sm:text-[3.8rem]">
                {post.title}
              </h1>
              {summaryText(post) ? <p className="mt-4 max-w-3xl text-[1.05rem] leading-7 text-[var(--tk-text)]">{summaryText(post)}</p> : null}
              <div className="mt-5 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--tk-muted)]">
                <span>{SITE_CONFIG.name}</span>
                {getField(post, ['location', 'address', 'city']) ? <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> {getField(post, ['location', 'address', 'city'])}</span> : null}
              </div>

              <HeroMedia task={task} post={post} />
              <BodyContent post={post} />
              {task === 'article' ? <EditableArticleComments slug={post.slug} comments={comments} /> : null}
            </article>

            <aside className="space-y-6">
              <InfoPanel task={task} post={post} />
              <GalleryPanel post={post} />
              <RelatedPanel task={task} related={related} />
            </aside>
          </div>
        </div>
      </main>
    </EditableSiteShell>
  )
}

function BackLink({ task }: { task: TaskKey }) {
  const taskConfig = getTaskConfig(task)
  return (
    <Link href={taskConfig?.route || '/'} className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.12em] text-[var(--tk-accent)]">
      <ArrowLeft className="h-4 w-4" /> Back to {taskConfig?.label || 'posts'}
    </Link>
  )
}

function HeroMedia({ task, post }: { task: TaskKey; post: SitePost }) {
  const images = getImages(post)
  const main = images[0] || '/placeholder.svg?height=900&width=1200'

  if (task === 'image') {
    return (
      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        {images.length ? images.slice(0, 6).map((image, index) => (
          <img key={`${image}-${index}`} src={image} alt={post.title} className="w-full border border-[var(--tk-line)] object-cover" />
        )) : <img src={main} alt={post.title} className="w-full border border-[var(--tk-line)] object-cover sm:col-span-2" />}
      </div>
    )
  }

  return (
    <div className="mt-7 overflow-hidden border border-[var(--tk-line)] bg-[var(--tk-raised)]">
      <img src={main} alt={post.title} className="aspect-[16/10] w-full object-cover" />
    </div>
  )
}

function BodyContent({ post }: { post: SitePost }) {
  return (
    <div
      className="article-content mt-8 max-w-none text-[1.02rem] leading-8 text-[var(--tk-text)]"
      dangerouslySetInnerHTML={{ __html: formatPlainText(getBody(post)) }}
    />
  )
}

function InfoPanel({ task, post }: { task: TaskKey; post: SitePost }) {
  const website = getField(post, ['website', 'url', 'link'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const location = getField(post, ['location', 'address', 'city'])
  const role = getField(post, ['role', 'designation', 'company'])

  return (
    <div className="border border-[var(--tk-line)] bg-[#F8DE22] p-5 text-[#D12052]">
      <h2 className="editable-display text-[2rem] font-black uppercase leading-none tracking-[-0.05em]">Details</h2>
      <div className="mt-5 space-y-3">
        <DetailLine label="Section" value={getTaskConfig(task)?.label || task} />
        <DetailLine label="Category" value={categoryOf(post, 'Featured')} />
        {location ? <DetailLine label="Location" value={location} /> : null}
        {role ? <DetailLine label="Role" value={role} /> : null}
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        {website ? <Link href={website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-[var(--tk-accent)] px-4 py-3 text-sm font-black uppercase tracking-[0.12em] text-white">Visit <ExternalLink className="h-4 w-4" /></Link> : null}
        {phone ? <a href={`tel:${phone}`} className="inline-flex items-center gap-2 border border-[#D12052]/20 bg-white px-4 py-3 text-sm font-black uppercase tracking-[0.12em] text-[var(--tk-accent)]"><Phone className="h-4 w-4" /> Call</a> : null}
        {email ? <a href={`mailto:${email}`} className="inline-flex items-center gap-2 border border-[#D12052]/20 bg-white px-4 py-3 text-sm font-black uppercase tracking-[0.12em] text-[var(--tk-accent)]"><Mail className="h-4 w-4" /> Email</a> : null}
      </div>
      {!website && !phone && !email ? (
        <p className="mt-5 text-sm leading-6 text-[#D12052]/80">This post focuses on the story and visuals, so there are no direct action links attached.</p>
      ) : null}
    </div>
  )
}

function DetailLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border border-[#D12052]/12 bg-white px-4 py-3 text-sm">
      <span className="font-black uppercase tracking-[0.12em] text-[var(--tk-accent)]">{label}</span>
      <span className="text-right font-semibold text-[#D12052]">{value}</span>
    </div>
  )
}

function GalleryPanel({ post }: { post: SitePost }) {
  const images = getImages(post).slice(1, 5)
  if (!images.length) return null
  return (
    <div className="border border-[var(--tk-line)] bg-white p-5">
      <h2 className="editable-display text-[2rem] font-black uppercase leading-none tracking-[-0.05em] text-[var(--tk-accent)]">More images</h2>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {images.map((image, index) => (
          <img key={`${image}-${index}`} src={image} alt="" className="aspect-[4/3] w-full border border-[var(--tk-line)] object-cover" />
        ))}
      </div>
    </div>
  )
}

function RelatedPanel({ task, related }: { task: TaskKey; related: SitePost[] }) {
  if (!related.length) return null
  const taskRoute = getTaskConfig(task)?.route || `/${task}`
  return (
    <div className="border border-[var(--tk-line)] bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="editable-display text-[2rem] font-black uppercase leading-none tracking-[-0.05em] text-[var(--tk-accent)]">More picks</h2>
        <Link href={taskRoute} className="text-xs font-black uppercase tracking-[0.12em] text-[#D12052]">View all</Link>
      </div>
      <div className="mt-5 space-y-4">
        {related.map((item) => {
          const image = getImages(item)[0]
          const href = `${taskRoute}/${item.slug}`
          return (
            <Link key={item.id || item.slug} href={href} className="grid gap-3 border-b border-[var(--tk-line)] pb-4 last:border-b-0 last:pb-0 sm:grid-cols-[96px_minmax(0,1fr)]">
              <div className="overflow-hidden border border-[var(--tk-line)] bg-[var(--tk-raised)]">
                {image ? <img src={image} alt={item.title} className="aspect-square h-full w-full object-cover" /> : <div className="flex aspect-square items-center justify-center"><FallbackIcon task={task} /></div>}
              </div>
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#D12052]">{categoryOf(item, getTaskConfig(task)?.label || task)}</p>
                <h3 className="editable-display mt-1 text-[1.35rem] font-black uppercase leading-[0.95] tracking-[-0.05em] text-[var(--tk-accent)]">{item.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm leading-6 text-[var(--tk-text)]">{summaryText(item) || 'A related pick from this section.'}</p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

function FallbackIcon({ task }: { task: TaskKey }) {
  if (task === 'sbm') return <Globe2 className="h-6 w-6 text-[var(--tk-accent)]" />
  if (task === 'profile') return <UserRound className="h-6 w-6 text-[var(--tk-accent)]" />
  return <FileText className="h-6 w-6 text-[var(--tk-accent)]" />
}
