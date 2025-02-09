import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import QRCode from 'qrcode'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const ticketData = await request.json()
    console.log('Received ticket data:', ticketData)

    // Validate input
    if (!ticketData.name || !ticketData.email || !ticketData.ticketType) {
      console.log('Missing required fields')
      return NextResponse.json({ message: 'Missing required fields', receivedData: ticketData }, { status: 400 })
    }

    // Check if the ticket type is "Cast Member" and if we've reached the limit
    if (ticketData.ticketType === "Cast Member") {
      const castMemberCount = await prisma.ticket.count({
        where: { ticketType: "Cast Member" }
      })
      if (castMemberCount >= 16) {
        console.log('Cast Member tickets are sold out')
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

    console.log('Ticket booked successfully:', ticket)
    return NextResponse.json({ message: 'Ticket booked successfully', ticket })
  } catch (error) {
    console.error('Error booking ticket:', error)
    return NextResponse.json({ message: 'Failed to book ticket', error: (error as Error).message }, { status: 500 })
  }
}
