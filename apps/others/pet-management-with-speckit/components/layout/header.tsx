import { logout } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Nav } from './nav'

interface HeaderProps {
  userEmail: string
}

export function Header({ userEmail }: HeaderProps) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🐾</span>
              <h1 className="text-xl font-bold">Pet Management</h1>
            </div>
            <Nav />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">{userEmail}</span>
            <form action={logout}>
              <Button type="submit" variant="outline" size="sm">
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </div>
    </header>
  )
}
