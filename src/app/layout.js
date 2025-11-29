import { Inter, Bebas_Neue, Libre_Baskerville, Roboto, Roboto_Condensed, Oswald, Source_Sans_3, Playfair_Display } from 'next/font/google'
import './globals.css'
import { Analytics } from "@vercel/analytics/react"


const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const fontbebas = Bebas_Neue({
  subsets: ['latin'],
  variable: '--font-bebas',
  weight: '400'
})

const fontroboto = Roboto({
  subsets: ['latin'],
  variable: '--font-roboto',
  weight: '400'
})

const fontlibre = Libre_Baskerville({
  subsets: ['latin'],
  variable: '--font-libre',
  weight: '400'
})

const fontRobotoCondensed = Roboto_Condensed({
  subsets: ['latin'],
  variable: '--font-roboto-condensed',
  weight: '400'
})

const fontOswald = Oswald({
  subsets: ['latin'],
  variable: '--font-oswald',
  weight: '400'
})

const fontSourceSansPro = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-source-sans-3',
  weight: '400'
})

const fontPlayfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair-display',
  weight: '400'
})

export const metadata = {
  title: 'Dao Ho',
  description: 'Design Portfolio by Dao Ho',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${fontbebas.variable} ${fontlibre.variable} ${fontroboto.variable} ${fontRobotoCondensed.variable} ${fontOswald.variable} ${fontSourceSansPro.variable} ${fontPlayfairDisplay.variable} scroll-smooth overflow-x-clip`}>{children}</body>
      <Analytics />
    </html>
    
  )
}
