import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Button from './Button'

describe('Button component', () => {
  it('renders with children', () => {
    render(<Button>Write Now</Button>)
    expect(screen.getByText(/write now/i)).toBeInTheDocument()
  })

  it('applies variant classes', () => {
    const { container } = render(<Button variant="outline">Outline</Button>)
    expect(container.firstChild).toHaveClass('btn-outline')
  })
})
