'use client'

import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { MessageCircle, Send } from 'lucide-react'

type Comment = { id: string; name: string; comment: string; createdAt: string }

const storageKey = (slug: string) => `editable:article-comments:${slug}`

function timeAgo(value?: string) {
  if (!value) return ''
  const then = new Date(value).getTime()
  if (Number.isNaN(then)) return ''
  const mins = Math.max(1, Math.floor((Date.now() - then) / 60000))
  if (mins < 60) return `${mins} min ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} hr ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} ${days === 1 ? 'day' : 'days'} ago`
  return new Date(then).toLocaleDateString()
}

function initial(name: string) {
  return (name.trim()[0] || 'G').toUpperCase()
}

export function EditableArticleComments({ slug, comments = [] }: { slug: string; comments?: Comment[] }) {
  const [stored, setStored] = useState<Comment[]>([])
  const [name, setName] = useState('')
  const [text, setText] = useState('')

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey(slug))
      setStored(raw ? (JSON.parse(raw) as Comment[]) : [])
    } catch {
      setStored([])
    }
  }, [slug])

  const persist = (next: Comment[]) => {
    setStored(next)
    try {
      window.localStorage.setItem(storageKey(slug), JSON.stringify(next))
    } catch {
      setStored(next)
    }
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const body = text.trim()
    if (!body) return
    const entry: Comment = {
      id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: name.trim() || 'Guest',
      comment: body,
      createdAt: new Date().toISOString(),
    }
    persist([entry, ...stored])
    setText('')
  }

  const all = useMemo(() => [...stored, ...comments], [stored, comments])

  return (
    <section className="mt-14 border-t border-[var(--tk-line)] pt-8">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center bg-[var(--tk-accent)] text-white">
          <MessageCircle className="h-5 w-5" />
        </span>
        <div>
          <h2 className="editable-display text-[2rem] font-black uppercase leading-none tracking-[-0.05em] text-[var(--tk-accent)]">Comments</h2>
          <p className="text-sm font-semibold text-[var(--tk-muted)]">{all.length} replies</p>
        </div>
      </div>

      <form onSubmit={submit} className="mt-6 border border-[var(--tk-line)] bg-[#F8DE22] p-5">
        <div className="grid gap-3 sm:grid-cols-[220px_minmax(0,1fr)]">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Your name"
            maxLength={60}
            className="h-12 border border-[#D12052]/15 bg-white px-4 text-sm text-[var(--tk-text)] outline-none"
          />
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Share your thoughts"
            rows={3}
            maxLength={1500}
            className="w-full resize-y border border-[#D12052]/15 bg-white px-4 py-3 text-sm leading-6 text-[var(--tk-text)] outline-none"
          />
        </div>
        <div className="mt-3 flex justify-end">
          <button
            type="submit"
            disabled={!text.trim()}
            className="inline-flex items-center gap-2 bg-[var(--tk-accent)] px-5 py-3 text-sm font-black uppercase tracking-[0.12em] text-white disabled:opacity-50"
          >
            <Send className="h-4 w-4" /> Post comment
          </button>
        </div>
      </form>

      <div className="mt-6 grid gap-4">
        {all.map((comment) => (
          <div key={comment.id} className="border border-[var(--tk-line)] bg-white p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center bg-[#f1f1f1] text-sm font-black text-[var(--tk-accent)]">
                {initial(comment.name)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-black uppercase tracking-[0.12em] text-[var(--tk-accent)]">{comment.name || 'Guest'}</p>
                {comment.createdAt ? <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--tk-muted)]">{timeAgo(comment.createdAt)}</p> : null}
              </div>
            </div>
            <p className="mt-3 whitespace-pre-line text-sm leading-6 text-[var(--tk-text)]">{comment.comment}</p>
          </div>
        ))}
        {!all.length ? <p className="text-sm font-semibold text-[var(--tk-muted)]">Be the first to comment.</p> : null}
      </div>
    </section>
  )
}
