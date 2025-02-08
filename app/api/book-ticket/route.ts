import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import QRCode from "qrcode"
import nodemailer from "nodemailer"

const prisma = new PrismaClient()

export async function POST(request: Request) {
  const ticketData = await request.json()

  // Check if the ticket type is "Cast Member" and if we've reached the limit
  if (ticketData.ticketType === "Cast Member") {
    const castMemberCount = await prisma.ticket.count({
      where: { ticketType: "Cast Member" },
    })
    if (castMemberCount >= 16) {
      return NextResponse.json({ message: "Cast Member tickets are sold out" }, { status: 400 })
    }
  }

  try {
    // Generate QR code
    const qrCode = await QRCode.toDataURL(JSON.stringify(ticketData))

    // Save ticket with QR code
    const ticket = await prisma.ticket.create({
      data: { ...ticketData, qrCode },
    })

    // Send email notification
    const transporter = nodemailer.createTransport({
      // Configure your email service here
      host: "smtp.example.com",
      port: 587,
      secure: false,
      auth: {
        user: "your-email@example.com",
        pass: "your-password",
      },
    })

    await transporter.sendMail({
      from: '"ADS Films" <noreply@adsfilms.com>',
      to: ticketData.email,
      subject: "Your Ticket for The Body in the Night",
      html: `
        <h1>Your Ticket for The Body in the Night</h1>
        <p>Thank you for booking a ticket to our premiere!</p>
        <p>Name: ${ticketData.name}</p>
        <p>Ticket Type: ${ticketData.ticketType}</p>
        <p>Price: $${ticketData.price.toFixed(2)}</p>
        <img src="${qrCode}" alt="Ticket QR Code" />
      `,
    })

    return NextResponse.json({ message: "Ticket booked successfully", ticket })
  } catch (error) {
    console.error("Error booking ticket:", error)
    return NextResponse.json({ message: "Failed to book ticket" }, { status: 500 })
  }
}

