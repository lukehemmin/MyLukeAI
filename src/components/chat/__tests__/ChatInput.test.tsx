import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ChatInput } from '../ChatInput'

describe('ChatInput', () => {
  it('should render input field and send button', () => {
    render(<ChatInput onSend={vi.fn()} isStreaming={false} onStop={vi.fn()} disabled={false} />)
    
    expect(screen.getByPlaceholderText('메시지를 입력하세요...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /전송/i })).toBeInTheDocument()
  })

  it('should be disabled when disabled prop is true', () => {
    render(<ChatInput onSend={vi.fn()} isStreaming={false} onStop={vi.fn()} disabled={true} />)
    
    const input = screen.getByPlaceholderText('메시지를 입력하세요...')
    const button = screen.getByRole('button', { name: /전송/i })
    
    expect(input).toBeDisabled()
    expect(button).toBeDisabled()
  })

  it('should call onSend when form is submitted', () => {
    const mockSend = vi.fn()
    render(<ChatInput onSend={mockSend} isStreaming={false} onStop={vi.fn()} disabled={false} />)
    
    const input = screen.getByPlaceholderText('메시지를 입력하세요...')
    const form = input.closest('form') || input.parentElement?.querySelector('button')?.parentElement
    
    // In the component, it's not a form, but input + button. 
    // The test used to look for form submission, but the component handles Enter key and Button click.
    // Let's check how the component works. 
    // It has onKeyDown for Enter.
    
    fireEvent.change(input, { target: { value: 'Hello AI' } })
    // Simulate Enter key
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })
    
    expect(mockSend).toHaveBeenCalledWith('Hello AI')
    expect(input).toHaveValue('') // Input should be cleared after submission
  })

  it('should not call onSend when input is empty', () => {
    const mockSend = vi.fn()
    render(<ChatInput onSend={mockSend} isStreaming={false} onStop={vi.fn()} disabled={false} />)
    
    const input = screen.getByPlaceholderText('메시지를 입력하세요...')
    
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })
    
    expect(mockSend).not.toHaveBeenCalled()
  })

  it('should handle Enter key press to submit', () => {
    const mockSend = vi.fn()
    render(<ChatInput onSend={mockSend} isStreaming={false} onStop={vi.fn()} disabled={false} />)
    
    const input = screen.getByPlaceholderText('메시지를 입력하세요...')
    
    fireEvent.change(input, { target: { value: 'Hello AI' } })
    fireEvent.keyDown(input, { key: 'Enter', shiftKey: false })
    
    expect(mockSend).toHaveBeenCalledWith('Hello AI')
  })

  it('should not submit on Shift+Enter', () => {
    const mockSend = vi.fn()
    render(<ChatInput onSend={mockSend} isStreaming={false} onStop={vi.fn()} disabled={false} />)
    
    const input = screen.getByPlaceholderText('메시지를 입력하세요...')
    
    fireEvent.change(input, { target: { value: 'Hello\nAI' } })
    fireEvent.keyDown(input, { key: 'Enter', shiftKey: true })
    
    expect(mockSend).not.toHaveBeenCalled()
    expect(input).toHaveValue('Hello\nAI') // Newline should be preserved
  })
})