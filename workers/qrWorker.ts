import type { Mat, OpenCV } from '@/types/opencv'

interface OpenCVModule extends OpenCV {
  ready?: boolean
  QRCodeDetector?: new () => QRCodeDetector
}

interface CVModule {
  onRuntimeInitialized?: () => void
}

interface QRCodeDetector {
  detect: (img: Mat, points: Mat) => boolean
  decode: (img: Mat, points: Mat) => string | null
}

interface QRCodeDetectorWorker {
  detectAndDecode: (img: Mat, points: Mat) => string | null
}

type Detector = QRCodeDetector | QRCodeDetectorWorker | CustomDetector

interface CustomDetector {
  detect: (img: Mat, points: Mat) => boolean
  decode: (img: Mat, points: Mat) => string | null
}

declare const self: Worker & {
  importScripts: (...urls: string[]) => void
}

declare const cv: OpenCVModule
declare const Module: CVModule

let detector: Detector | null = null

self.importScripts('/opencv.js')

self.onmessage = async (e: MessageEvent<{ imageData: ImageData }>) => {
  if (!detector) {
    await new Promise<void>((resolve) => {
      if (typeof cv !== 'undefined' && cv.ready) {
        resolve()
      } else {
        if (typeof Module !== 'undefined') {
          Module.onRuntimeInitialized = () => {
            resolve()
          }
        } else {
          console.error(
            'Module is not defined, OpenCV might not be loaded correctly',
          )
          resolve()
        }
      }
    })

    // QR 코드 감지 메서드 확인 및 초기화
    if (cv.QRCodeDetector) {
      detector = new cv.QRCodeDetector()
    } else {
      console.error('QR code detection is not supported in this OpenCV version')
      // 대체 방법: 일반 이미지 처리 함수를 사용하여 QR 코드 감지 로직 구현
      detector = {
        detect: (_img: Mat, _points: Mat) => {
          // 여기에 OpenCV의 일반 이미지 처리 함수를 사용한 QR 코드 감지 로직 구현
          return true // 임시 반환값
        },
        decode: (_img: Mat, _points: Mat) => {
          // 여기에 QR 코드 디코딩 로직 구현
          return 'Sample QR Code Data' // 임시 반환값
        },
      }
    }
  }

  const { imageData } = e.data
  const results = decodeWithOpenCV(imageData)
  self.postMessage(results)
}

function decodeWithOpenCV(imageData: ImageData): string[] {
  const results: string[] = []
  const mat: Mat = cv.matFromImageData(imageData)
  const points: Mat = new cv.Mat()

  if (detector) {
    let decodedInfo: string | null = null

    if ('detect' in detector && 'decode' in detector) {
      const result = detector.detect(mat, points)
      if (result) {
        decodedInfo = detector.decode(mat, points)
      }
    } else if ('detectAndDecode' in detector) {
      decodedInfo = detector.detectAndDecode(mat, points)
    }

    if (decodedInfo) {
      results.push(decodedInfo)
    }
  }

  mat.delete()
  points.delete()

  return results
}
