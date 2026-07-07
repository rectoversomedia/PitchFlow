import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from './button'
import { Input } from './input'
import { Card, CardHeader, CardContent, CardFooter } from './card'

// ==================== BUTTON TESTS ====================

describe('Button Component', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('handles click events', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies variant classes', () => {
    const { rerender } = render(<Button variant="default">Button</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()

    rerender(<Button variant="destructive">Destructive</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('applies size classes', () => {
    const { rerender } = render(<Button size="default">Button</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()

    rerender(<Button size="sm">Small</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()

    rerender(<Button size="lg">Large</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()

    rerender(<Button size="icon">Icon</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
})

// ==================== INPUT TESTS ====================

describe('Input Component', () => {
  it('renders with placeholder', () => {
    render(<Input placeholder="Enter text..." />)
    expect(screen.getByPlaceholderText('Enter text...')).toBeInTheDocument()
  })

  it('handles text input', () => {
    render(<Input placeholder="Enter text..." />)
    const input = screen.getByPlaceholderText('Enter text...')
    fireEvent.change(input, { target: { value: 'Hello World' } })
    expect((input as HTMLInputElement).value).toBe('Hello World')
  })

  it('handles disabled state', () => {
    render(<Input disabled placeholder="Disabled input" />)
    expect(screen.getByPlaceholderText('Disabled input')).toBeDisabled()
  })
})

// ==================== CARD TESTS ====================

describe('Card Components', () => {
  it('renders Card with children', () => {
    render(<Card><p>Card Content</p></Card>)
    expect(screen.getByText('Card Content')).toBeInTheDocument()
  })

  it('renders CardHeader', () => {
    render(<CardHeader><h2>Card Title</h2></CardHeader>)
    expect(screen.getByText('Card Title')).toBeInTheDocument()
  })

  it('renders CardContent', () => {
    render(<CardContent><p>Content goes here</p></CardContent>)
    expect(screen.getByText('Content goes here')).toBeInTheDocument()
  })

  it('renders CardFooter', () => {
    render(<CardFooter><button>Action</button></CardFooter>)
    expect(screen.getByText('Action')).toBeInTheDocument()
  })

  it('composes Card with all sub-components', () => {
    render(
      <Card>
        <CardHeader>
          <h2>Title</h2>
        </CardHeader>
        <CardContent>
          <p>Content</p>
        </CardContent>
        <CardFooter>
          <button>Action</button>
        </CardFooter>
      </Card>
    )
    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
    expect(screen.getByText('Action')).toBeInTheDocument()
  })
})
