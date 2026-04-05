import type { Metadata } from "next"
import { Playfair_Display, Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { SitoProvider } from "@/components/SitoProvider"
import { CookieBanner } from "@/components/CookieBanner"

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
  title: {
    default: "Funerix — Servizi Funebri in Campania",
    template: "%s | Funerix",
  },
  description:
    "Configura il servizio funebre per il tuo caro con rispetto e trasparenza. Preventivo indicativo immediato. Impresa funebre autorizzata in Campania.",
  keywords: [
    "onoranze funebri",
    "funerali Campania",
    "servizi funebri Napoli",
    "cremazione Campania",
    "impresa funebre",
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="it" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2C3E50" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/images/logo.png" />
        <script dangerouslySetInnerHTML={{ __html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
              navigator.serviceWorker.register('/sw.js').catch(() => {});
            });
          }
        `}} />
      </head>
      <body className="min-h-screen flex flex-col bg-background text-text">
        <SitoProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CookieBanner />
        </SitoProvider>
      </body>
    </html>
  )
}
