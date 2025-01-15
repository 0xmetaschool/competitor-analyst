import './globals.css'
import React from 'react'

export const metadata = {
  title: 'Competitor Analysis AI',
  description: 'AI-powered competitor analysis tool',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
