import type { Metadata } from "next"
import { Playfair_Display, Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { SitoProvider } from "@/components/SitoProvider"
import { CookieBanner } from "@/components/CookieBanner"
import { headers } from "next/headers"

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
})

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://funerix.com"),
  title: {
    default: "Funerix — Servizi Funebri in Campania",
    template: "%s | Funerix",
  },
  description:
    "Configurate il servizio funebre con rispetto e trasparenza. Preventivo indicativo immediato. Impresa funebre autorizzata in Campania.",
  keywords: [
    "onoranze funebri",
    "funerali Campania",
    "servizi funebri Napoli",
    "cremazione Campania",
    "impresa funebre",
  ],
  openGraph: {
    type: "website",
    locale: "it_IT",
    url: "https://funerix.com",
    siteName: "Funerix",
    title: "Funerix — Servizi Funebri in Campania",
    description: "Configurate il servizio funebre con rispetto e trasparenza. Preventivo immediato, cremazione, previdenza, rimpatri, pet. Campania 24/7.",
    images: [{ url: "/images/og-funerix.png", width: 1200, height: 630, alt: "Funerix — Servizi Funebri" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Funerix — Servizi Funebri in Campania",
    description: "Configurate il servizio funebre con rispetto e trasparenza. Preventivo immediato. Campania 24/7.",
    images: ["/images/og-funerix.png"],
  },
  alternates: {
    canonical: "https://funerix.com",
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Detect admin routes to hide public header/footer
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || headersList.get('x-invoke-path') || ''
  const isAdmin = pathname.startsWith('/admin')

  return (
    <html lang="it" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2C3E50" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/favicon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <script dangerouslySetInnerHTML={{ __html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
          }
        `}} />
      </head>
      <body className={`min-h-screen ${isAdmin ? '' : 'flex flex-col'} bg-background text-text`}>
        <SitoProvider>
          {!isAdmin && <Header />}
          {isAdmin ? children : <main className="flex-1">{children}</main>}
          {!isAdmin && <Footer />}
          {!isAdmin && <CookieBanner />}
        </SitoProvider>
      </body>
    </html>
  )
}
