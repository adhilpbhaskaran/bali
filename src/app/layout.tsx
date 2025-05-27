import { Inter } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import RootLayoutContent from './layout-content'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Bali Malayali - Your Gateway to Bali',
  description: 'Discover the magic of Bali with our tailor-made travel packages',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <RootLayoutContent>{children}</RootLayoutContent>
        </body>
      </html>
    </ClerkProvider>
  )
}
