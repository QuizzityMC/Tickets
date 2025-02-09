import { NextResponse } from "next/server"
import QRCode from "qrcode"
import nodemailer from "nodemailer"

// In-memory storage for tickets
const tickets: any[] = []

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: "smtp.zoho.eu",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

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

    // Send confirmation email
    try {
      await transporter.sendMail({
        from: '"ADS Films" <noreply@adsfilms.com>',
        to: ticketData.email,
        subject: "Your Ticket for The Body in the Night",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1>Your Ticket for The Body in the Night</h1>
            <p>Thank you for booking a ticket to our premiere!</p>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Name:</strong> ${ticketData.name}</p>
              <p><strong>Ticket Type:</strong> ${ticketData.ticketType}</p>
              <p><strong>Price:</strong> $${ticketData.price.toFixed(2)}</p>
              <p><strong>Date:</strong> March 21, 2025</p>
              <p><strong>Venue:</strong> ADS Films Theater</p>
            </div>
            <div style="text-align: center; margin: 20px 0;">
              <img src="${qrCode}" alt="Ticket QR Code" style="max-width: 200px;"/>
            </div>
            <p style="color: #666;">Please keep this email and show the QR code at the entrance.</p>
            <p style="color: #666;">Payment will be collected at the venue.</p>
          </div>
        `,
      })
      console.log("Confirmation email sent to:", ticketData.email)
    } catch (error) {
      console.error("Error sending confirmation email:", error)
      // Don't return an error response here, as the ticket was still created successfully
    }

    console.log("Ticket booked successfully:", ticket)
    return NextResponse.json({ message: "Ticket booked successfully", ticket })
  } catch (error) {
    console.error("Error booking ticket:", error)
    return NextResponse.json({ message: "Failed to book ticket", error: (error as Error).message }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json(tickets)
}

