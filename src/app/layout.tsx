import type { Metadata } from 'next'

import { Inter, JetBrains_Mono } from 'next/font/google'
import { Toaster } from 'sonner'
import '@/styles/globals.css'

import { ThemeProvider } from './_components/theme-provider'

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Discovery Chess Tournament Registration',
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
  metadataBase: new URL('https://app.discoverycentre.co.ke'),
  openGraph: {
    title: 'Discovery Chess Tournament Registration',
    description: 'Register for the Discovery Chess Tournament. Secure your spot, make M-PESA payments, and join the competition.',
    url: 'https://app.discoverycentre.co.ke',
    siteName: 'Discovery Chess Tournament',
    locale: 'en_KE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Discovery Chess Tournament Registration',
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <main>
            {children}
          </main>
          <Toaster position="bottom-left" richColors duration={10000} closeButton />
        </ThemeProvider>
      </body>
    </html>
  )
}
