import { Analytics } from '@vercel/analytics/react'
import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'
import React from 'react'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'

import '@/styles/tailwind.css'
import 'focus-visible'

export const metadata = {
  title: {
    template: '%s - Suleyman Kiani',
    default: 'Suleyman Kiani - Software Engineer & Founder',
  },
  description:
    'Suleyman Kiani\'s personal portfolio showcasing technology, problem-solving, and fitness expertise.',
  keywords: ['Suleyman Kiani', 'full-stack developer', 'cloud solutions', 'fitness', 'personal trainer'],
  metadataBase: new URL('https://suleyman.io'),
  openGraph: {
    title: 'Suleyman\'s Personal CV',
    description: "More than a portfolio; it's a place where technology, problem-solving, and fitness collide.",
    url: 'https://suleyman.io',
    siteName: 'Suleyman Kiani',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

const modeScript = `
  let darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

  updateMode()
  darkModeMediaQuery.addEventListener('change', updateModeWithoutTransitions)
  window.addEventListener('storage', updateModeWithoutTransitions)

  function updateMode() {
    let isSystemDarkMode = darkModeMediaQuery.matches
    let isDarkMode = window.localStorage.isDarkMode === 'true' || (!('isDarkMode' in window.localStorage) && isSystemDarkMode)

    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    if (isDarkMode === isSystemDarkMode) {
      delete window.localStorage.isDarkMode
    }
  }

  function disableTransitionsTemporarily() {
    document.documentElement.classList.add('[&_*]:!transition-none')
    window.setTimeout(() => {
      document.documentElement.classList.remove('[&_*]:!transition-none')
    }, 0)
  }

  function updateModeWithoutTransitions() {
    disableTransitionsTemporarily()
    updateMode()
  }
`

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html className="h-full antialiased" lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: modeScript }} />
        <link
          rel="alternate"
          type="application/rss+xml"
          href={`${process.env.NEXT_PUBLIC_SITE_URL}/rss/feed.xml`}
        />
        <link
          rel="alternate"
          type="application/feed+json"
          href={`${process.env.NEXT_PUBLIC_SITE_URL}/rss/feed.json`}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Suleyman Kiani",
              "url": "https://suleyman.io",
              "image": "https://suleyman.io/profile-image.jpg",
              "jobTitle": "Full-Stack Developer & Personal Trainer",
              "sameAs": [
                "https://linkedin.com/in/suleyman-kiani",
                "https://github.com/kianis4",
                "https://twitter.com/svley"
              ],
              "description": "Cloud solutions enthusiast, problem solver, full-stack developer, and personal trainer."
            })
          }}
        />
      </head>
      <body className="flex h-full flex-col bg-zinc-50 dark:bg-black">
        <div className="fixed inset-0 flex justify-center sm:px-8">
          <div className="flex w-full max-w-7xl lg:px-8">
            <div className="w-full bg-white ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-zinc-300/20" />
          </div>
        </div>
        <div className="relative">
          <Header />
          <main>{children}</main>
          <Footer />
        </div>
        <Analytics />
      </body>
    </html>
  )
}
