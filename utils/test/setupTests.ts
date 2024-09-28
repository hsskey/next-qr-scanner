import { afterAll, afterEach, vi } from 'vitest'
import '@testing-library/jest-dom'

afterEach(() => {
  vi.clearAllMocks()
})

afterAll(() => {
  vi.resetAllMocks()
})

class MockWorker {
  onmessage: ((event: MessageEvent) => void) | null = null
  onerror: ((event: ErrorEvent) => void) | null = null
  postMessage = vi.fn()
  terminate = vi.fn()
  addEventListener = vi.fn()
  removeEventListener = vi.fn()
  dispatchEvent = vi.fn()
}

const workerMockInstances: MockWorker[] = []

const MockWorkerConstructor = vi.fn(() => {
  const worker = new MockWorker()
  workerMockInstances.push(worker)
  return worker
})

vi.stubGlobal('Worker', MockWorkerConstructor)

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

Object.defineProperty(window, 'MediaStream', {
  writable: true,
  value: vi.fn().mockImplementation(() => ({
    id: 'mock-stream-id',
    active: true,
    getTracks: vi.fn().mockReturnValue([]),
    addTrack: vi.fn(),
    removeTrack: vi.fn(),
    clone: vi.fn(),
    dispatchEvent: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })),
})

export { workerMockInstances }
