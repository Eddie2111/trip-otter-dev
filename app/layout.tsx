import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'sonner'
import { MobileNavigation } from '@/components/mobile-navigation'
import Providers from './providers'
import { DesktopSidebar } from '@/components/desktop-sidebar'

export const metadata: Metadata = {
  title: 'TripOtter',
  description: 'Created with v0',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <Toaster />
        <Providers>
          <DesktopSidebar />
          {children}
          <MobileNavigation />
        </Providers>
      </body>
    </html>
  );
}
