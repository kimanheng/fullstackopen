import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('Blog component tests', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Test Author',
    url: 'http://testing-react.com',
    likes: 42,
    user: {
      username: 'tester',
      name: 'Test User'
    }
  }

  const currentUser = {
    username: 'tester',
    name: 'Test User'
  }

  test('renders title and author, but not url or likes by default', () => {
    render(<Blog blog={blog} handleLike={() => {}} handleDelete={() => {}} currentUser={currentUser} />)

    // Check title and author are rendered
    expect(screen.getByText(/Component testing is done with react-testing-library/)).toBeInTheDocument()
    expect(screen.getByText(/Test Author/)).toBeInTheDocument()

    // Check url and likes are not visible/rendered
    expect(screen.queryByText('http://testing-react.com')).toBeNull()
    expect(screen.queryByText('likes 42')).toBeNull()
  })

  test('renders url and likes when view button is clicked', async () => {
    render(<Blog blog={blog} handleLike={() => {}} handleDelete={() => {}} currentUser={currentUser} />)

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    // Details should be rendered
    expect(screen.getByText('http://testing-react.com')).toBeInTheDocument()
    expect(screen.getByText('likes 42')).toBeInTheDocument()
    expect(screen.getByText(/added by Test User/)).toBeInTheDocument()
  })

  test('clicking like button twice calls handleLike twice', async () => {
    const mockLike = vi.fn()

    render(<Blog blog={blog} handleLike={mockLike} handleDelete={() => {}} currentUser={currentUser} />)

    const user = userEvent.setup()
    
    // Expand to show the like button
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    // Find and click like button twice
    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockLike).toHaveBeenCalledTimes(2)
  })
})
