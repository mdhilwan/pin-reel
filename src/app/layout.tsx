import '../styles/globals.css'
import { GoogleAnalytics } from '@next/third-parties/google'

export const metadata = {
  title: 'Pin Reel',
  description: 'Pin your reels on a map',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
      <GoogleAnalytics gaId={"G-V633VYV6YM"}/>
    </html>
  )
}
