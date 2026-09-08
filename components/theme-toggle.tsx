'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

export function ThemeToggle() {
  const [dark, setDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setDark(document.documentElement.classList.contains('dark'))
  }, [])

  const toggle = () => {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('sahay-theme', next ? 'dark' : 'light')
  }

  if (!mounted) return <div className="h-9 w-9" />

  return (
    <button
      onClick={toggle}
      className="group relative flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-secondary/60 text-muted-foreground transition-all duration-300 hover:border-primary/30 hover:bg-secondary hover:text-foreground"
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <Sun
        size={16}
        className={`absolute transition-all duration-300 ${dark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}`}
      />
      <Moon
        size={16}
        className={`absolute transition-all duration-300 ${dark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'}`}
      />
    </button>
  )
}
