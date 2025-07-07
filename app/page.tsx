import { SessionProvider } from "next-auth/react"
import { TripotterFeed } from "@/components/tripotter-feed"

export default function Home() {
  return (
    <SessionProvider>
      <TripotterFeed />
    </SessionProvider>
  )
}
