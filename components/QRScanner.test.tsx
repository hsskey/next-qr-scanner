import QRScanner from '@/components/QRScanner'
import useCamera from '@/hooks/useCamera'
import render from '@/utils/test/render'
import { workerMockInstances } from '@/utils/test/setupTests'
import { act } from '@testing-library/react'
import { type MockedFunction, vi } from 'vitest'

vi.mock('@/hooks/useCamera')

describe('QRScanner 컴포넌트', () => {
  const mockUseCamera = useCamera as MockedFunction<typeof useCamera>

  beforeEach(() => {
    mockUseCamera.mockReturnValue({
      stream: null,
      error: null,
    })
    vi.clearAllMocks()
    workerMockInstances.length = 0
  })

  it('카메라 접근 에러를 표시하는지 테스트합니다.', async () => {
    const mockError = new Error('Camera access denied')
    mockUseCamera.mockReturnValue({
      stream: null,
      error: mockError,
    })

    const { findByText } = await render(<QRScanner />)
    expect(await findByText(`Error: ${mockError.message}`)).toBeInTheDocument()
  })

  it('Worker 에러를 표시하는지 테스트합니다.', async () => {
    mockUseCamera.mockReturnValue({
      stream: new MediaStream(),
      error: null,
    })

    const { findByText } = await render(<QRScanner />)

    const workerInstance = workerMockInstances[0]
    await act(async () => {
      workerInstance.onerror?.(
        new ErrorEvent('error', { message: 'Worker error' }),
      )
    })

    expect(await findByText('Worker Error: Worker error')).toBeInTheDocument()
  })

  it('QR 코드를 감지하고 결과를 표시하는지 테스트합니다.', async () => {
    mockUseCamera.mockReturnValue({
      stream: new MediaStream(),
      error: null,
    })

    const { findByText } = await render(<QRScanner />)

    const workerInstance = workerMockInstances[0]
    await act(async () => {
      workerInstance.onmessage?.(
        new MessageEvent('message', { data: ['Sample QR Code Data'] }),
      )
    })

    expect(await findByText('QR Code Detected:')).toBeInTheDocument()
    expect(await findByText('Sample QR Code Data')).toBeInTheDocument()
  })
})
