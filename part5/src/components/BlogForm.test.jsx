import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('BlogForm component tests', () => {
  test('form calls the event handler callback with correct details when submit is clicked', async () => {
    const mockCreateBlog = vi.fn()
    const user = userEvent.setup()

    render(<BlogForm createBlog={mockCreateBlog} />)

    const titleInput = screen.getByPlaceholderText('Title of the blog')
    const authorInput = screen.getByPlaceholderText('Author of the blog')
    const urlInput = screen.getByPlaceholderText('URL of the blog')
    const submitButton = screen.getByText('create')

    // Simulate inputting data
    await user.type(titleInput, 'Testing React Forms')
    await user.type(authorInput, 'Form Author')
    await user.type(urlInput, 'http://form-test.com')

    // Submit form
    await user.click(submitButton)

    expect(mockCreateBlog).toHaveBeenCalledTimes(1)
    expect(mockCreateBlog.mock.calls[0][0]).toEqual({
      title: 'Testing React Forms',
      author: 'Form Author',
      url: 'http://form-test.com'
    })
  })
})
