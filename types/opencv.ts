export interface Mat {
  delete(): void
}

export interface QRCodeDetector {
  detect(image: Mat, points: Mat): boolean
  decode(image: Mat, points: Mat): string | null
}

export interface QRCodeDetectorWorker {
  detectAndDecode(image: Mat, points: Mat): string | null
}

export interface OpenCV {
  Mat: new () => Mat
  matFromImageData(imageData: ImageData): Mat
  QRCodeDetector?: new () => QRCodeDetector
  QRCodeDetectorWorker?: new () => QRCodeDetectorWorker
}

export type QRCodeDetectionResult = string
