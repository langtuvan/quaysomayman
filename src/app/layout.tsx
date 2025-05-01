'use client'
import { AuthProvider } from '@/auth/context/jwt'
import {
  AdminClient,
  ApolloProvider,
} from '@/providers/apolloClient/ApolloProvider'
import '@/styles/tailwind.css'
import { Suspense } from 'react'

// export const metadata: Metadata = {
//   title: {
//     template: '%s - Radiant',
//     default: 'Radiant - Close every deal',
//   },
// }

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/css?f%5B%5D=switzer@400,500,600,700&amp;display=swap"
        />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="The Radiant Blog"
          href="/blog/feed.xml"
        />
      </head>
      <body className="text-gray-950 antialiased">
        <AuthProvider>
          <ApolloProvider client={AdminClient}>
            <Suspense> {children}</Suspense>
          </ApolloProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
