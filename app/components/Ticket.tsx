import Image from "next/image"

interface TicketProps {
  name: string
  type: string
  qrCode: string
}

export default function Ticket({ name, type, qrCode }: TicketProps) {
  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl m-4">
      <div className="md:flex">
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">ADS Films Presents</div>
          <h1 className="block mt-1 text-lg leading-tight font-medium text-black">The Body in the Night</h1>
          <p className="mt-2 text-gray-500">Premiere Ticket</p>
          <div className="mt-4">
            <p className="text-gray-700">
              <strong>Name:</strong> {name}
            </p>
            <p className="text-gray-700">
              <strong>Ticket Type:</strong> {type}
            </p>
            <p className="text-gray-700">
              <strong>Date:</strong> March 21, 2025
            </p>
            <p className="text-gray-700">
              <strong>Venue:</strong> ADS Films Theater
            </p>
          </div>
        </div>
        <div className="md:flex-shrink-0">
          <Image
            src="https://avatars.githubusercontent.com/u/197720306?s=400&u=9a293903952ddfb6a267037ec58690c7090348eb&v=4"
            alt="ADS Films Logo"
            width={200}
            height={200}
            className="h-48 w-full object-cover md:w-48"
          />
        </div>
      </div>
      <div className="p-8">
        <Image src={qrCode || "/placeholder.svg"} alt="Ticket QR Code" width={200} height={200} />
      </div>
    </div>
  )
}

