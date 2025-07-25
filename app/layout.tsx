import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'sonner'
import { MobileNavigation } from '@/components/mobile-navigation'
import Providers from './providers'
import { DesktopSidebar } from '@/components/desktop-sidebar'

export const metadata: Metadata = {
  title: {
    template: "%s | Tripotter",
    default: "Tripotter",
  },
  description:
    "Tripotter is a social media platform for travelers to share their adventures, discover new destinations, and connect with fellow explorers.",
  openGraph: {
    title: "Tripotter",
    description:
      "Share your travel experiences and connect with a global community of travelers on Tripotter.",
    type: "website",
    images: [
      {
        url: "/path/to/your/tripotter/logo.webp",
        width: 600,
        height: 600,
        alt: "Tripotter Logo",
      },
    ],
  },
};

function SEOKeyWords() {
  return (
    <div>
      <h1 className="z-[-1000] absolute text-transparent">Tripotter</h1>
      <h1 className="z-[-1000] absolute text-transparent">Trip otter</h1>
      <h1 className="z-[-1000] absolute text-transparent">tripotter</h1>
      <h1 className="z-[-1000] absolute text-transparent">trip otter</h1>
      <h1 className="z-[-1000] absolute text-transparent">trip ottar</h1>
      <h1 className="z-[-1000] absolute text-transparent">Trip ottar</h1>
      <h1 className="z-[-1000] absolute text-transparent">TRIPOTTER</h1>
      <h1 className="z-[-1000] absolute text-transparent">TRIPOTTAR</h1>
      <h1 className="z-[-1000] absolute text-transparent">TRIP OTTER</h1>
      <h1 className="z-[-1000] absolute text-transparent">TRIP OTTAR</h1>
      <h1 className="z-[-1000] absolute text-transparent">
        social media for travelers
      </h1>
      <h1 className="z-[-1000] absolute text-transparent">travel community</h1>
      <h1 className="z-[-1000] absolute text-transparent">travel blog</h1>
      <h1 className="z-[-1000] absolute text-transparent">
        share travel photos
      </h1>
      <h1 className="z-[-1000] absolute text-transparent">
        find travel destinations
      </h1>
      <h1 className="z-[-1000] absolute text-transparent">
        connect with travelers
      </h1>
      <h1 className="z-[-1000] absolute text-transparent">explore the world</h1>
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
      <SEOKeyWords />
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
