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
            src="https://media.discordapp.net/attachments/1207191526220890152/1336935709961093140/adsfilmslogo.png?ex=67a840e8&is=67a6ef68&hm=c8998036121e42c5da6bd1cdc041556f49fa40ff83ffbee355876b1d7ccc83dc&=&format=webp&quality=lossless"
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

