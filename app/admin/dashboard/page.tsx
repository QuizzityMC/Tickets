import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { PrismaClient } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"
import { Button } from "@/components/ui/button"

const prisma = new PrismaClient()

async function getTicketData() {
  const tickets = await prisma.ticket.findMany()
  return tickets
}

export default async function AdminDashboard() {
  const session = await getServerSession()

  if (!session) {
    redirect("/admin/login")
  }

  const tickets = await getTicketData()

  const ticketTypeCount = tickets.reduce(
    (acc, ticket) => {
      acc[ticket.ticketType] = (acc[ticket.ticketType] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const chartData = Object.entries(ticketTypeCount).map(([name, value]) => ({ name, value }))

  const totalRevenue = tickets.reduce((sum, ticket) => sum + ticket.price, 0)
  const totalAttendees = tickets.length

  // Daily ticket sales data
  const dailySales = tickets.reduce(
    (acc, ticket) => {
      const date = new Date(ticket.createdAt).toISOString().split("T")[0]
      acc[date] = (acc[date] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const dailySalesData = Object.entries(dailySales).map(([date, count]) => ({ date, count }))

  // CSV export function
  async function exportCSV() {
    const csv = [
      ["Name", "Email", "Ticket Type", "Price", "Created At"],
      ...tickets.map((ticket) => [
        ticket.name,
        ticket.email,
        ticket.ticketType,
        ticket.price,
        ticket.createdAt.toISOString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "ticket_data.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Total Attendees</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{totalAttendees}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">${totalRevenue.toFixed(2)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Most Popular Ticket</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">
                {Object.entries(ticketTypeCount).reduce((a, b) => (a[1] > b[1] ? a : b))[0]}
              </p>
            </CardContent>
          </Card>
        </div>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Ticket Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Daily Ticket Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailySalesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="count" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Attendee List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Button onClick={exportCSV}>Export CSV</Button>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ticket Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{ticket.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{ticket.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{ticket.ticketType}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${ticket.price.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(ticket.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

