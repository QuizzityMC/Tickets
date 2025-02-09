import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

async function getTicketData() {
  const response = await fetch("http://localhost:9028/api/book-ticket", { cache: "no-store" })
  const tickets = await response.json()
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
                {ticketTypeCount && Object.entries(ticketTypeCount).length > 0 
                  ? Object.entries(ticketTypeCount).reduce((a, b) => (a[1] > b[1] ? a : b))[0]
                  : 'No ticket types available'}
              </p>
            </CardContent>
          </Card>
        </div>

        <DashboardCharts chartData={chartData} dailySalesData={dailySalesData} />

        <Card>
          <CardHeader>
            <CardTitle>Attendee List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Button>Export CSV</Button>
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
