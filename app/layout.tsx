import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { OnScreenKeyboard } from "./components/OnScreenKeyboard"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ADS Films - The Body in the Night Premiere Ticket Booking",
  description: "Book your tickets for the premiere of The Body in the Night by ADS Films",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <OnScreenKeyboard />
      </body>
    </html>
  )
}

