// /src/pages/_app.tsx

import { useEffect, useRef } from 'react'
import Head from 'next/head'
import { Analytics } from '@vercel/analytics/react'
import Image from 'next/image'
import Link from 'next/link'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'

import '@/styles/tailwind.css'
import 'focus-visible'

function usePrevious(value) {
  let ref = useRef()

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}

export default function App({ Component, pageProps, router }) {
  let previousPathname = usePrevious(router.pathname)
  const isInstaPage = router.pathname === '/insta'

  return (
    <>
      <Head>
        {/* Basic SEO */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Suleyman Kiani's personal portfolio showcasing technology, problem-solving, and fitness expertise." />
        <meta name="keywords" content="Suleyman Kiani, full-stack developer, cloud solutions, fitness, personal trainer" />
        <link rel="canonical" href={`https://suleyman.io${router.asPath}`} />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        
        {/* Existing Open Graph tags */}
        <meta property="og:title" content="Suleyman's Personal CV" />
        <meta property="og:description" content="More than a portfolio; it's a place where technology, problem-solving, and fitness collide." />
        <meta property="og:image" content="https://suleyman.io/og-image.png" />
        <meta property="og:url" content="https://suleyman.io" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        
        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Suleyman Kiani",
              "url": "https://suleyman.io",
              "image": "https://suleyman.io/profile-image.jpg", // Update with actual path
              "jobTitle": "Full-Stack Developer & Personal Trainer",
              "sameAs": [
                "https://linkedin.com/in/yourprofile", // Update these with your actual profiles
                "https://github.com/yourprofile",
                "https://twitter.com/yourprofile"
              ],
              "description": "Cloud solutions enthusiast, problem solver, full-stack developer, and personal trainer."
            })
          }}
        />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        
        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#3b82f6" />
      </Head>
      <div className="fixed inset-0 flex justify-center sm:px-8">
        <div className="flex w-full max-w-7xl lg:px-8">
          <div className="w-full bg-white ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-zinc-300/20" />
        </div>
      </div>
      {/* Main Layout */}
      <div className="relative">
        {/* Conditionally Render Header */}
        {!isInstaPage && <Header />}
        <main>
          <Component previousPathname={previousPathname} {...pageProps} />
        </main>
        {/* Conditionally Render Footer */}
        {!isInstaPage && <Footer />}
      </div>
      
      <Analytics />
    </>
  )
}
