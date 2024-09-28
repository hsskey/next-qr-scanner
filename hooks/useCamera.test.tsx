import useCamera from '@/hooks/useCamera'
import { act, renderHook } from '@testing-library/react'

describe('useCamera', () => {
  const mockGetUserMedia = vi.fn()

  beforeAll(() => {
    Object.defineProperty(window.navigator, 'mediaDevices', {
      writable: true,
      value: {
        getUserMedia: mockGetUserMedia,
      },
    })

    Object.defineProperty(window, 'MediaStream', {
      writable: true,
      value: vi.fn().mockImplementation(() => ({
        id: 'mock-stream-id',
        active: true,
        getTracks: vi.fn().mockReturnValue([]),
      })),
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('카메라 스트림을 성공적으로 가져오는지 테스트합니다.', async () => {
    const mockStream = new MediaStream()
    mockGetUserMedia.mockResolvedValueOnce(mockStream)

    const { result } = renderHook(() => useCamera())

    await act(async () => {
      await Promise.resolve()
    })

    expect(result.current.stream).toBe(mockStream)
    expect(result.current.error).toBeNull()
    expect(mockGetUserMedia).toHaveBeenCalledWith({
      video: { facingMode: 'environment' },
      audio: false,
    })
  })

  it('카메라 접근 실패 시 에러를 처리하는지 테스트합니다.', async () => {
    const mockError = new Error('Camera access denied')
    mockGetUserMedia.mockRejectedValueOnce(mockError)

    const { result } = renderHook(() => useCamera())

    await act(async () => {
      await Promise.resolve()
    })

    expect(result.current.stream).toBeNull()
    expect(result.current.error).toBe(mockError)
    expect(mockGetUserMedia).toHaveBeenCalledWith({
      video: { facingMode: 'environment' },
      audio: false,
    })
  })
})
