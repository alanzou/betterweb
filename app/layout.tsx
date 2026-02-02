import type { Metadata } from 'next'
import { Inter, Orbitron } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Better Web - Modern Web Solutions',
  description: 'Transform your digital presence with cutting-edge web development solutions',
  keywords: ['web development', 'modern web', 'digital solutions'],
  authors: [{ name: 'Better Web' }],
  creator: 'Better Web',
  publisher: 'Better Web',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://betterweb.com'),
  openGraph: {
    title: 'Better Web - Modern Web Solutions',
    description: 'Transform your digital presence with cutting-edge web development solutions',
    type: 'website',
    locale: 'en_US',
    siteName: 'Better Web',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Better Web - Modern Web Solutions',
    description: 'Transform your digital presence with cutting-edge web development solutions',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
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
    <html lang="en" className={`${inter.variable} ${orbitron.variable}`}>
      <body className="min-h-screen bg-[#050510] text-white overflow-x-hidden antialiased">
        {children}
        
        {/* Chatwoot Live Chat Widget */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(d,t) {
                var BASE_URL="https://app.chatwoot.com";
                var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
                g.src=BASE_URL+"/packs/js/sdk.js";
                g.defer = true;
                g.async = true;
                s.parentNode.insertBefore(g,s);
                g.onload=function(){
                  window.chatwootSDK.run({
                    websiteToken: '${process.env.NEXT_PUBLIC_CHATWOOT_TOKEN || 'YOUR_CHATWOOT_TOKEN'}',
                    baseUrl: BASE_URL
                  })
                }
              })(document,"script");
            `,
          }}
        />
      </body>
    </html>
  )
}
