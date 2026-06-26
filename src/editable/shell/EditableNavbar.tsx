'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogIn, Menu, PlusCircle, Search, UserPlus, X } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()
  const navItems = useMemo(
    () => SITE_CONFIG.tasks
      .filter((task) => task.enabled && task.key !== 'image' && task.key !== 'listing')
      .slice(0, 5)
      .map((task, index) => ({
        label: globalContent.nav.primaryLinks[index]?.label || task.label,
        href: task.route,
      })),
    []
  )

  return (
    <header className="sticky top-0 z-50 shadow-[0_4px_16px_rgba(0,0,0,0.18)]">
      <div className="bg-[linear-gradient(180deg,#03AED2_0%,#0897b7_52%,#D12052_100%)] text-[var(--editable-nav-text)]">
        <nav className="mx-auto flex min-h-[84px] w-full max-w-[var(--editable-container)] items-center gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="group flex shrink-0 items-center">
            <div className="flex items-center gap-3 pr-4">
              <img
                src="/favicon.png"
                alt={SITE_CONFIG.name}
                className="h-14 w-auto object-contain drop-shadow-[0_2px_0_rgba(0,0,0,0.18)] sm:h-16"
              />
              <span className="editable-display text-[1.6rem] font-black uppercase leading-[0.82] tracking-[-0.06em] text-[var(--editable-nav-text)] sm:text-[1.9rem]">
                {SITE_CONFIG.name.split('.')[0]}
              </span>
            </div>
          </Link>

          <div className="hidden flex-1 items-center justify-center gap-8 lg:flex">
            {navItems.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`editable-display relative text-center text-[1.05rem] font-bold uppercase leading-none tracking-[-0.05em] transition ${
                    active ? 'text-white' : 'text-[var(--editable-nav-text)] hover:text-white'
                  }`}
                >
                  {item.label}
                  {active ? <span className="absolute left-0 right-0 top-full mt-1 h-[3px] bg-[#F8DE22]" /> : null}
                </Link>
              )
            })}
          </div>

          <div className="ml-auto hidden items-center gap-3 md:flex">
            <form action="/search" className="flex h-11 items-center border border-white/20 bg-white px-3 text-sm text-[var(--slot4-page-text)]">
              <Search className="h-4 w-4 text-[var(--slot4-accent)]" />
              <input
                name="q"
                type="search"
                placeholder="Search"
                className="w-28 bg-transparent px-2 outline-none placeholder:text-[var(--slot4-muted-text)] lg:w-36"
              />
            </form>
            {session ? (
              <>
                <Link
                  href="/create"
                  className="inline-flex items-center gap-2 bg-[var(--editable-cta-bg)] px-4 py-2 text-[11px] font-black uppercase tracking-[0.14em] text-[var(--editable-cta-text)]"
                >
                  <PlusCircle className="h-3.5 w-3.5" /> Create
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="text-[11px] font-black uppercase tracking-[0.14em] text-white/85 transition hover:text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.14em] text-white/90 hover:text-white">
                  <LogIn className="h-3.5 w-3.5" /> Login
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 bg-[var(--editable-cta-bg)] px-4 py-2 text-[11px] font-black uppercase tracking-[0.14em] text-[var(--editable-cta-text)]"
                >
                  <UserPlus className="h-3.5 w-3.5" /> Join
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="ml-auto border border-white/20 bg-white/10 p-2 text-white lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>
      </div>

      {open ? (
        <div className="border-b border-[var(--editable-border)] bg-white lg:hidden">
          <div className="mx-auto max-w-[var(--editable-container)] px-4 py-4 sm:px-6">
            <form action="/search" className="mb-4 flex h-11 items-center border border-[var(--editable-border)] bg-white px-3 text-sm">
              <Search className="h-4 w-4 text-[var(--slot4-accent)]" />
              <input name="q" type="search" placeholder="Search" className="flex-1 bg-transparent px-2 outline-none" />
            </form>
            <div className="grid gap-1">
              {[{ label: 'Home', href: '/' }, ...navItems, { label: 'Contact', href: '/contact' }].map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`editable-display px-3 py-3 text-base font-bold uppercase tracking-[-0.04em] ${
                      active ? 'bg-[var(--slot4-accent)] text-white' : 'text-[var(--slot4-page-text)]'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
              {session ? (
                <>
                  <Link href="/create" onClick={() => setOpen(false)} className="editable-display px-3 py-3 text-base font-bold uppercase tracking-[-0.04em] text-[var(--slot4-page-text)]">
                    Create
                  </Link>
                  <button type="button" onClick={logout} className="px-3 py-3 text-left text-sm font-bold uppercase tracking-[0.14em] text-[var(--slot4-muted-text)]">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setOpen(false)} className="editable-display px-3 py-3 text-base font-bold uppercase tracking-[-0.04em] text-[var(--slot4-page-text)]">
                    Login
                  </Link>
                  <Link href="/signup" onClick={() => setOpen(false)} className="editable-display px-3 py-3 text-base font-bold uppercase tracking-[-0.04em] text-[var(--slot4-page-text)]">
                    Join
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}
