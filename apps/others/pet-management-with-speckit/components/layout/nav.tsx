'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export function Nav() {
  const pathname = usePathname()

  const links = [
    { href: '/pets', label: 'My Pets' },
    { href: '/pets/new', label: 'Add Pet' },
  ]

  return (
    <nav className="flex gap-6">
      {links.map((link) => {
        const isActive = pathname === link.href || pathname.startsWith(link.href + '/')
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'text-sm font-medium transition-colors hover:text-slate-900',
              isActive ? 'text-slate-900' : 'text-slate-600'
            )}
          >
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
