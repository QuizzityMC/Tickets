import { NextResponse } from "next/server"
import QRCode from "qrcode"

// In-memory storage for tickets
const tickets: any[] = []

export async function POST(request: Request) {
  try {
    const ticketData = await request.json()
    console.log("Received ticket data:", ticketData)

    // Validate input
    if (!ticketData.name || !ticketData.email || !ticketData.ticketType) {
      console.log("Missing required fields")
      return NextResponse.json({ message: "Missing required fields", receivedData: ticketData }, { status: 400 })
    }

    // Check if the ticket type is "Cast Member" and if we've reached the limit
    if (ticketData.ticketType === "Cast Member") {
      const castMemberCount = tickets.filter((ticket) => ticket.ticketType === "Cast Member").length
      if (castMemberCount >= 16) {
        console.log("Cast Member tickets are sold out")
        return NextResponse.json({ message: "Cast Member tickets are sold out" }, { status: 400 })
      }
    }

    // Generate QR code
    const qrCodeData = JSON.stringify({
      name: ticketData.name,
      email: ticketData.email,
      ticketType: ticketData.ticketType,
      price: ticketData.price,
    })
    const qrCode = await QRCode.toDataURL(qrCodeData)

    // Save ticket with QR code
    const ticket = {
      id: tickets.length + 1,
      ...ticketData,
      qrCode,
      createdAt: new Date().toISOString(),
    }
    tickets.push(ticket)

    console.log("Ticket booked successfully:", ticket)
    return NextResponse.json({ message: "Ticket booked successfully", ticket })
  } catch (error) {
    console.error("Error booking ticket:", error)
    return NextResponse.json({ message: "Failed to book ticket", error: (error as Error).message }, { status: 500 })
  }
}

// GET method to retrieve all tickets (for admin dashboard)
export async function GET() {
  return NextResponse.json(tickets)
}

