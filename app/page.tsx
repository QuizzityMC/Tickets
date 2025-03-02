import TicketBookingForm from "./components/TicketBookingForm"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "ADS Films - The Body in the Night Premiere Ticket Booking",
  description: "Book your tickets for the premiere of The Body in the Night by ADS Films",
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">The Body in the Night - Premiere Ticket Booking - FAKE WEBSITE - NO REAL TICKETS</h1>
        <TicketBookingForm />
      </div>
    </main>
  )
}

