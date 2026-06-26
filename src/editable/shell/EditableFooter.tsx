'use client'

import Link from 'next/link'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableFooter() {
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <footer className="mt-auto border-t border-[#a71941] bg-[var(--editable-footer-bg)] text-[var(--editable-footer-text)]">
      <div className="mx-auto grid max-w-[var(--editable-container)] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <img src="/favicon.png" alt={SITE_CONFIG.name} className="h-16 w-auto object-contain" />
            <span className="editable-display text-[2rem] font-black uppercase leading-[0.82] tracking-[-0.06em] text-[#F8DE22]">
              {SITE_CONFIG.name.split('.')[0]}
            </span>
          </Link>
          <p className="mt-4 max-w-md text-sm leading-7 text-white/80">{globalContent.footer.description}</p>
        </div>

        {globalContent.footer.columns.slice(1).map((column) => (
          <div key={column.title}>
            <h3 className="editable-display text-xl font-bold uppercase tracking-[-0.04em] text-[#F8DE22]">{column.title}</h3>
            <div className="mt-4 grid gap-2">
              {column.links.map((link) => (
                <Link key={link.href} href={link.href} className="text-sm font-semibold text-white/80 transition hover:text-white">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-white/15">
        <div className="mx-auto flex max-w-[var(--editable-container)] flex-col gap-3 px-4 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-white/65 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <span>{year} {SITE_CONFIG.name}. {globalContent.footer.bottomNote}</span>
          <div className="flex flex-wrap gap-4">
            <Link href="/about" className="hover:text-white">About</Link>
            <Link href="/contact" className="hover:text-white">Contact</Link>
            {session ? <button type="button" onClick={logout} className="hover:text-white">Logout</button> : <Link href="/login" className="hover:text-white">Login</Link>}
          </div>
        </div>
      </div>
    </footer>
  )
}
