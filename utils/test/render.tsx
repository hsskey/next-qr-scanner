import { type RenderResult, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactElement } from 'react'

export default async (
  component: ReactElement,
): Promise<RenderResult & { user: ReturnType<typeof userEvent.setup> }> => {
  const user = userEvent.setup()

  return {
    user,
    ...render(component),
  }
}
