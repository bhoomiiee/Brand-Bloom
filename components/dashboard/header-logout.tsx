'use client'

import { useState } from 'react'
import { signOut } from 'next-auth/react'
import { LogOut } from 'lucide-react'

export function HeaderLogout() {
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    if (confirm('Are you sure you want to log out?')) {
      setIsLoggingOut(true)
      await signOut({ callbackUrl: '/auth/signin' })
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      title="Log out"
      className="p-2 text-[#806B73] hover:text-[#632D40] hover:bg-[#F1D9DF]/50 rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold ml-1 cursor-pointer"
    >
      <LogOut className="h-3.5 w-3.5 text-[#BD7C91]" />
      <span className="hidden md:inline">{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
    </button>
  )
}
