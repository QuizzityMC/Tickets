import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import QRCode from 'qrcode'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const ticketData = await request.json()

    // Validate input
    if (!ticketData.name || !ticketData.email || !ticketData.ticketType) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 })
    }

    // Check if the ticket type is "Cast Member" and if we've reached the limit
    if (ticketData.ticketType === "Cast Member") {
      const castMemberCount = await prisma.ticket.count({
        where: { ticketType: "Cast Member" }
      })
      if (castMemberCount >= 16) {
        return NextResponse.json({ message: 'Cast Member tickets are sold out' }, { status: 400 })
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
    const ticket = await prisma.ticket.create({
      data: { ...ticketData, qrCode }
    })

    // For now, we'll skip email sending to simplify troubleshooting
    // You can re-enable this later once the basic functionality is working

    return NextResponse.json({ message: 'Ticket booked successfully', ticket })
  } catch (error) {
    console.error('Error booking ticket:', error)
    return NextResponse.json({ message: 'Failed to book ticket', error: (error as Error).message }, { status: 500 })
  }
}
