import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Learning Management System',
  description: 'A basic LMS with JWT authentication and learning path recommendations',
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