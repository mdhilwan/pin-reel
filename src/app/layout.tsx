import '../styles/globals.css'

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
    </html>
  )
}
