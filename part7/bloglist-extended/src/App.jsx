import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Routes, Route, Link, useMatch, useNavigate } from 'react-router-dom'

// Components
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

// Actions & Thunks
import { setNotification } from './reducers/notificationReducer'
import { initializeBlogs, createBlog, likeBlog, deleteBlog, commentBlog } from './reducers/blogReducer'
import { loadUserFromLocalStorage, loginUser, logoutUser } from './reducers/userReducer'
import { initializeUsersList } from './reducers/usersListReducer'

// Navigation Component
const NavMenu = ({ user, handleLogout }) => {
  return (
    <nav className="nav-menu">
      <div className="nav-links">
        <Link className="nav-link" to="/">blogs</Link>
        <Link className="nav-link" to="/users">users</Link>
      </div>
      <div className="nav-user">
        <span>Logged in as <strong>{user.name || user.username}</strong></span>
        <button className="btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }} onClick={handleLogout}>
          logout
        </button>
      </div>
    </nav>
  )
}

// User List Component
const UsersList = ({ users }) => {
  return (
    <div className="card">
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Blogs Created</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>
                <Link to={`/users/${u.id}`}>{u.name || u.username}</Link>
              </td>
              <td>{u.blogs ? u.blogs.length : 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Single User View Component
const UserView = ({ user }) => {
  if (!user) return <div>User not found</div>

  const userBlogs = user.blogs || []

  return (
    <div className="details-view">
      <h2>{user.name || user.username}</h2>
      <h3>added blogs</h3>
      {userBlogs.length === 0 ? (
        <p>No blogs added yet</p>
      ) : (
        <ul style={{ paddingLeft: '20px' }}>
          {userBlogs.map(b => (
            <li key={b.id} style={{ marginBlock: '5px' }}>
              <Link to={`/blogs/${b.id}`} style={{ color: '#818cf8', fontWeight: 500 }}>{b.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// Single Blog View Component
const BlogView = ({ blog, handleLike, handleDelete, currentUser, handleAddComment }) => {
  const [comment, setComment] = useState('')
  const navigate = useNavigate()

  if (!blog) return <div>Blog not found</div>

  const showDelete = () => {
    if (!currentUser || !blog.user) return false
    const blogUsername = blog.user.username || blog.user
    return blogUsername === currentUser.username
  }

  const onDeleteClick = () => {
    if (window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)) {
      handleDelete(blog.id)
      navigate('/')
    }
  }

  const onCommentSubmit = (e) => {
    e.preventDefault()
    if (!comment.trim()) return
    handleAddComment(blog.id, comment)
    setComment('')
  }

  return (
    <div className="details-view">
      <h2>{blog.title} - <span style={{ fontWeight: 400, color: '#94a3b8' }}>{blog.author}</span></h2>
      <div>
        <a href={blog.url} target="_blank" rel="noopener noreferrer" className="details-url">
          {blog.url}
        </a>
      </div>
      <div className="details-likes">
        <span><strong>{blog.likes}</strong> likes</span>
        <button className="btn-primary" onClick={() => handleLike(blog)}>like</button>
      </div>
      <div className="details-creator">
        added by {blog.user?.name || blog.user?.username || 'unknown'}
      </div>
      {showDelete() && (
        <button className="btn-danger" style={{ marginBottom: '1.5rem' }} onClick={onDeleteClick}>
          remove
        </button>
      )}

      <div className="comments-container">
        <h3>comments</h3>
        <form onSubmit={onCommentSubmit} style={{ display: 'flex', gap: '10px', maxWidth: '500px' }}>
          <input 
            type="text" 
            value={comment} 
            onChange={({ target }) => setComment(target.value)} 
            placeholder="Write a comment..."
            style={{ margin: 0 }}
            required
          />
          <button type="submit" className="btn-primary">add comment</button>
        </form>
        <ul className="comments-list">
          {(blog.comments || []).map((c, i) => (
            <li key={i} className="comment-item">
              {c}
            </li>
          ))}
          {(blog.comments || []).length === 0 && (
            <p style={{ color: '#64748b' }}>No comments yet. Be the first to comment!</p>
          )}
        </ul>
      </div>
    </div>
  )
}

// Main App Component
const App = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const blogFormRef = useRef()

  // Redux Selectors
  const blogs = useSelector(state => [...state.blogs].sort((a, b) => b.likes - a.likes))
  const user = useSelector(state => state.user)
  const usersList = useSelector(state => state.usersList)

  // Initialize
  useEffect(() => {
    dispatch(loadUserFromLocalStorage())
    dispatch(initializeBlogs())
    dispatch(initializeUsersList())
  }, [dispatch])

  // Login handler
  const handleLoginSubmit = async (event) => {
    event.preventDefault()
    try {
      await dispatch(loginUser(username, password))
      setUsername('')
      setPassword('')
    } catch {
      // Notification handled in thunk
    }
  }

  // Logout handler
  const handleLogoutClick = () => {
    dispatch(logoutUser())
    navigate('/')
  }

  // Create blog handler
  const handleCreateBlogSubmit = async (blogObject) => {
    try {
      const returned = await dispatch(createBlog(blogObject))
      blogFormRef.current.toggleVisibility()
      dispatch(setNotification(`A new blog "${returned.title}" by ${returned.author} added`, 'success'))
      // Refresh users list since a blog was created
      dispatch(initializeUsersList())
    } catch (error) {
      dispatch(setNotification(`Error: ${error.response?.data?.error || error.message}`, 'error'))
    }
  }

  // Like blog handler
  const handleLikeClick = (blog) => {
    dispatch(likeBlog(blog))
  }

  // Delete blog handler
  const handleDeleteClick = (id) => {
    dispatch(deleteBlog(id))
      .then(() => {
        dispatch(setNotification('Blog deleted successfully', 'success'))
        dispatch(initializeUsersList())
      })
      .catch(() => {
        dispatch(setNotification('Failed to delete blog. You must be the owner.', 'error'))
      })
  }

  // Comment handler
  const handleCommentSubmit = (id, commentText) => {
    dispatch(commentBlog(id, commentText))
      .then(() => {
        dispatch(setNotification('Comment added!', 'success'))
      })
  }

  // Matching Route Params
  const userMatch = useMatch('/users/:id')
  const matchedUser = userMatch 
    ? usersList.find(u => u.id === userMatch.params.id)
    : null

  const blogMatch = useMatch('/blogs/:id')
  const matchedBlog = blogMatch 
    ? blogs.find(b => b.id === blogMatch.params.id)
    : null

  // If not logged in, render login form
  if (user === null) {
    return (
      <div className="app-container">
        <h2>Log in to Application</h2>
        <Notification />
        
        <div className="card">
          <form onSubmit={handleLoginSubmit}>
            <div>
              <label>Username</label>
              <input
                id="username"
                type="text"
                value={username}
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
      <NavMenu user={user} handleLogout={handleLogoutClick} />
      <h2>Blog List App</h2>
      <Notification />

      <Routes>
        <Route path="/" element={
          <div>
            <Togglable buttonLabel="Create new blog" ref={blogFormRef}>
              <BlogForm createBlog={handleCreateBlogSubmit} />
            </Togglable>

            <div style={{ marginTop: '2rem' }}>
              <h3>All Blogs</h3>
              <div className="blogs-list">
                {blogs.map(blog => (
                  <div key={blog.id} className="blog-row">
                    <Link className="blog-link" to={`/blogs/${blog.id}`}>
                      {blog.title} <span className="blog-author-span">by {blog.author}</span>
                    </Link>
                    <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>{blog.likes} likes</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        } />
        
        <Route path="/users" element={
          <UsersList users={usersList} />
        } />

        <Route path="/users/:id" element={
          <UserView user={matchedUser} />
        } />

        <Route path="/blogs/:id" element={
          <BlogView 
            blog={matchedBlog} 
            handleLike={handleLikeClick} 
            handleDelete={handleDeleteClick} 
            currentUser={user} 
            handleAddComment={handleCommentSubmit}
          />
        } />
      </Routes>
    </div>
  )
}

export default App
