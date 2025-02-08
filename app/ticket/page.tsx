import Ticket from "../components/Ticket"

export default function TicketPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const name = searchParams.name as string
  const type = searchParams.type as string

  if (!name || !type) {
    return <div>Invalid ticket information</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Your Ticket</h1>
        <Ticket name={name} type={type} />
        <div className="mt-8 text-center">
          <p className="text-gray-600">Please print this ticket or save it on your mobile device.</p>
          <p className="text-gray-600">Payment will be collected at the venue.</p>
        </div>
      </div>
    </div>
  )
}

