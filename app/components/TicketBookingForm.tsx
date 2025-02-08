"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

const ticketTypes = [
  { id: "family-adult", name: "Family Member/Adult", price: 0 },
  { id: "family-child", name: "Family Member/Child", price: 0 },
  { id: "adult", name: "Adult", price: 1.5 },
  { id: "child", name: "Child", price: 0.5 },
  { id: "cast", name: "Cast Member", price: 0 },
]

export default function TicketBookingForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [ticketType, setTicketType] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const selectedTicket = ticketTypes.find((ticket) => ticket.id === ticketType)
    if (!selectedTicket) return

    const ticketData = {
      name,
      email,
      ticketType: selectedTicket.name,
      price: selectedTicket.price,
    }

    try {
      const response = await fetch("/api/book-ticket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ticketData),
      })

      if (response.ok) {
        const data = await response.json()
        router.push(
          `/ticket?name=${encodeURIComponent(name)}&type=${encodeURIComponent(selectedTicket.name)}&qrCode=${encodeURIComponent(data.ticket.qrCode)}`,
        )
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.message || "Failed to book ticket",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error booking ticket:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="ticketType">Ticket Type</Label>
        <Select onValueChange={setTicketType} required>
          <SelectTrigger>
            <SelectValue placeholder="Select ticket type" />
          </SelectTrigger>
          <SelectContent>
            {ticketTypes.map((ticket) => (
              <SelectItem key={ticket.id} value={ticket.id}>
                {ticket.name} (${ticket.price.toFixed(2)})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full">
        Book Ticket
      </Button>
    </form>
  )
}

