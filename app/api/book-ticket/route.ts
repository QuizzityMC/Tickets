import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"
import QRCode from "qrcode"

const ticketsFilePath = path.join(process.cwd(), "data", "tickets.json")

export async function POST(request: Request) {
  console.log("Received ticket booking request")
  const ticketData = await request.json()
  console.log("Ticket data:", ticketData)

  try {
    // Read existing tickets
    let tickets = []
    try {
      const ticketsData = await fs.readFile(ticketsFilePath, "utf8")
      tickets = JSON.parse(ticketsData)
    } catch (error) {
      // If file doesn't exist, we'll start with an empty array
    }

    // Check if the ticket type is "Cast Member" and if we've reached the limit
    if (ticketData.ticketType === "Cast Member") {
      const castMemberCount = tickets.filter((t: any) => t.ticketType === "Cast Member").length
      if (castMemberCount >= 16) {
        return NextResponse.json({ message: "Cast Member tickets are sold out" }, { status: 400 })
      }
    }

    // Generate QR code
    const qrCode = await QRCode.toDataURL(JSON.stringify(ticketData))

    // Create new ticket
    const newTicket = {
      id: tickets.length + 1,
      ...ticketData,
      qrCode,
      createdAt: new Date().toISOString(),
    }

    // Add new ticket to the array
    tickets.push(newTicket)

    // Save updated tickets array
    await fs.writeFile(ticketsFilePath, JSON.stringify(tickets, null, 2))

    // TODO: Implement email sending logic here

    return NextResponse.json({ message: "Ticket booked successfully", ticket: newTicket })
  } catch (error) {
    console.error("Error booking ticket:", error)
    return NextResponse.json({ message: "Failed to book ticket" }, { status: 500 })
  }
}

