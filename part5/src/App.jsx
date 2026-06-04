import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)

  const blogFormRef = useRef()

  // Fetch blogs on load
  useEffect(() => {
    blogService.getAll().then(initialBlogs => {
      // Sort blogs by likes in descending order
      setBlogs(initialBlogs.sort((a, b) => b.likes - a.likes))
    })
  }, [])

  // Check for logged user in local storage
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const showNotification = (text, type = 'success') => {
    setMessage({ text, type })
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      showNotification(`Welcome back, ${user.name || user.username}!`)
    } catch (exception) {
      showNotification('Wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    showNotification('Logged out successfully')
  }

  const handleCreateBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      // Hide the form using ref
      blogFormRef.current.toggleVisibility()

      setBlogs(blogs.concat(returnedBlog).sort((a, b) => b.likes - a.likes))
      showNotification(`A new blog "${returnedBlog.title}" by ${returnedBlog.author || 'unknown'} added`)
    } catch (exception) {
      showNotification(`Failed to create blog: ${exception.response?.data?.error || exception.message}`, 'error')
    }
  }

  const handleLike = async (blog) => {
    try {
      const blogUsername = blog.user.username || blog.user
      const blogUserId = blog.user.id || blog.user

      const updatedBlog = {
        user: blogUserId,
        likes: blog.likes + 1,
        author: blog.author,
        title: blog.title,
        url: blog.url
      }

      const returnedBlog = await blogService.update(blog.id, updatedBlog)
      // Restore user details (backend PUT populates user, but let's make sure it is matched)
      if (!returnedBlog.user || typeof returnedBlog.user === 'string') {
        returnedBlog.user = blog.user
      }

      setBlogs(blogs.map(b => b.id !== blog.id ? b : returnedBlog).sort((a, b) => b.likes - a.likes))
    } catch (exception) {
      showNotification('Failed to like blog', 'error')
    }
  }

  const handleDelete = async (blog) => {
    if (window.confirm(`Remove blog "${blog.title}" by ${blog.author || 'unknown'}?`)) {
      try {
        await blogService.remove(blog.id)
        setBlogs(blogs.filter(b => b.id !== blog.id))
        showNotification(`Deleted "${blog.title}"`)
      } catch (exception) {
        showNotification('Failed to delete blog. You must be the owner.', 'error')
      }
    }
  }

  // Render login form
  if (user === null) {
    return (
      <div className="app-container">
        <h2>Log in to Application</h2>
        <Notification message={message} />
        
        <div className="card">
          <form onSubmit={handleLogin}>
            <div>
              <label>Username</label>
              <input
                id="username"
                type="text"
                value={username}
                name="Username"
                onChange={({ target }) => setUsername(target.value)}
                required
              />
            </div>
            <div>
              <label>Password</label>
              <input
                id="password"
                type="password"
                value={password}
                name="Password"
                onChange={({ target }) => setPassword(target.value)}
                required
              />
            </div>
            <button id="login-button" className="btn-primary" type="submit">Login</button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="app-container">
      <h2>Blogs</h2>
      <Notification message={message} />

      <div className="user-status">
        <span>Logged in as <strong>{user.name || user.username}</strong></span>
        <button className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={handleLogout}>
          Logout
        </button>
      </div>

      <Togglable buttonLabel="Create new blog" ref={blogFormRef}>
        <BlogForm createBlog={handleCreateBlog} />
      </Togglable>

      <div style={{ marginTop: '2rem' }}>
        <h3>All Posts</h3>
        <div className="blogs-list">
          {blogs.map(blog => (
            <Blog
              key={blog.id}
              blog={blog}
              handleLike={handleLike}
              handleDelete={handleDelete}
              currentUser={user}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
