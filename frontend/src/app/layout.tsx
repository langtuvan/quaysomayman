'use client'
import { AuthProvider } from '@/auth/context/jwt'
import {
  AdminClient,
  ApolloProvider,
} from '@/providers/apolloClient/ApolloProvider'
import '@/styles/tailwind.css'
import { Suspense } from 'react'
import {GOOGLE_TAG} from '@/config-global'
import { GoogleTagManager } from '@next/third-parties/google'
import Script from 'next/script'

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
        {GOOGLE_TAG && <GoogleTagManager gtmId={GOOGLE_TAG} />}

        {/* {data.GoogleAnalyticsId && (
          <>
            <Script
              src="https://api.webnextapp.com/public/googleScript/script.js"
              strategy="beforeInteractive"
            />
            <Script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${data.GoogleAnalyticsId}`}
              strategy="beforeInteractive"
            ></Script>
          </>
        )} */}
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
