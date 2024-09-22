import QRScanner from '@/components/QRScanner'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="mb-8 font-bold text-3xl text-gray-800">QR Code Scanner</h1>
      <QRScanner />
    </main>
  )
}
