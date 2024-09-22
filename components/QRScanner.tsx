'use client'

import useCamera from '@/hooks/useCamera'
import type { QRCodeDetectionResult } from '@/types/opencv'
import { useEffect, useRef, useState } from 'react'

export default function QRScanner() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [results, setResults] = useState<QRCodeDetectionResult[]>([])
  const { stream, error } = useCamera()
  const [workerError, setWorkerError] = useState<string | null>(null)

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream
    }
  }, [stream])

  useEffect(() => {
    if (!stream) return

    const worker = new Worker(
      new URL('../workers/qrWorker.ts', import.meta.url),
    )

    const captureFrame = () => {
      if (videoRef.current && canvasRef.current) {
        const canvas = canvasRef.current
        const video = videoRef.current
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          worker.postMessage({ imageData })
        }
      }
    }

    const captureInterval = setInterval(captureFrame, 200)

    worker.onmessage = (
      e: MessageEvent<QRCodeDetectionResult[] | { error: string }>,
    ) => {
      if (Array.isArray(e.data)) {
        setResults(e.data)
      } else if (e.data.error) {
        setWorkerError(e.data.error)
      }
    }

    worker.onerror = (e) => {
      setWorkerError(e.message)
    }

    return () => {
      clearInterval(captureInterval)
      worker.terminate()
    }
  }, [stream])

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>
  }

  if (workerError) {
    return <div className="text-red-500">Worker Error: {workerError}</div>
  }

  return (
    <div className="relative w-full max-w-md overflow-hidden rounded-lg border-2 border-gray-300">
      <video
        ref={videoRef}
        className="h-[300px] w-full object-cover"
        autoPlay
        playsInline
        muted
      >
        <track kind="captions" src="" label="captions" />
      </video>
      <canvas ref={canvasRef} className="hidden" />
      {results.length > 0 && (
        <div className="absolute top-2 right-2 left-2 max-h-[80%] overflow-y-auto rounded bg-white/90 p-3 shadow-md">
          <h3 className="mb-2 font-bold text-gray-800">QR Code Detected:</h3>
          <ul className="list-inside list-disc text-gray-700">
            {results.map((result) => (
              <li key={result} className="mb-1">
                {result}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
