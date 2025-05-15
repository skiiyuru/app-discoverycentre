import type { Metadata } from 'next'

import '@/styles/globals.css'
import {
  ClerkProvider,
} from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'

import { ThemeProvider } from './_components/theme-provider'

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Discovery Chess Junior Tournament',
  description: 'Register for the Discovery Chess Tournament. Secure your spot, make M-PESA payments, and join the competition.',
  keywords: ['chess tournament', 'chess competition', 'Discovery Centre', 'M-PESA payment', 'chess registration'],
  authors: [{ name: 'Discovery Centre' }],
  creator: 'Discovery Centre',
  publisher: 'Discovery Centre',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://app.thediscoverycentre.co.ke'),
  openGraph: {
    title: 'Discovery Chess Junior Tournament',
    description: 'Register for the Discovery Chess Tournament. Secure your spot, make M-PESA payments, and join the competition.',
    url: 'https://app.thediscoverycentre.co.ke',
    siteName: 'Discovery Chess Junior Tournament',
    locale: 'en_KE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Discovery Chess Junior Tournament',
    description: 'Register for the Discovery Chess Tournament. Secure your spot, make M-PESA payments, and join the competition.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      'index': true,
      'follow': true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${inter.variable} font-sans antialiased`}
        >
          {/* <header className="flex justify-end items-center p-4 gap-4 h-16">
            <SignedOut>
              <SignInButton />
              <SignUpButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </header> */}
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <main>
              {children}
            </main>
            <Toaster position="bottom-right" richColors duration={10000} closeButton />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
