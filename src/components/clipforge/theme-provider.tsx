'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { QueryProvider } from '@/components/clipforge/query-provider'

/**
 * AppProviders — composes ThemeProvider + QueryProvider.
 * Theme is dark-first (ClipForge is a dark-mode product); users can toggle
 * via the header switch. QueryProvider gives all views typed server state.
 */
export function AppProviders({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <QueryProvider>{children}</QueryProvider>
    </NextThemesProvider>
  )
}

/** Back-compat alias. */
export const ThemeProvider = AppProviders
