/**
 * ClipForge logo mark — a stylized play/clip glyph inside a rounded square.
 * Pure SVG, inherits currentColor for adaptive theming.
 */
import * as React from 'react'

export function ClipForgeLogo({
  className,
  size = 28,
}: {
  className?: string
  size?: number
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="cf-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="oklch(0.85 0.16 60)" />
          <stop offset="0.55" stopColor="oklch(0.72 0.18 45)" />
          <stop offset="1" stopColor="oklch(0.62 0.2 20)" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="30" height="30" rx="8" stroke="url(#cf-grad)" strokeWidth="1.5" />
      <path
        d="M13 10.5L21 16L13 21.5V10.5Z"
        fill="url(#cf-grad)"
      />
      {/* scissor/clip ticks */}
      <rect x="4.5" y="11" width="2.5" height="2.5" rx="0.6" fill="url(#cf-grad)" opacity="0.85" />
      <rect x="4.5" y="18.5" width="2.5" height="2.5" rx="0.6" fill="url(#cf-grad)" opacity="0.55" />
    </svg>
  )
}
