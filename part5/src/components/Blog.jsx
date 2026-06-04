import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, handleLike, handleDelete, currentUser }) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const showDeleteButton = () => {
    if (!currentUser || !blog.user) return false
    // Checks both username structures (API returns populated user object)
    const blogUsername = blog.user.username || blog.user
    return blogUsername === currentUser.username
  }

  return (
    <div className="blog-item">
      <div className="blog-header">
        <span className="blog-title-author">
          {blog.title} - <span style={{ fontWeight: 400, color: '#94a3b8' }}>{blog.author}</span>
        </span>
        <button className="btn-secondary" onClick={toggleVisibility}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>

      {visible && (
        <div className="blog-details">
          <div>
            <a href={blog.url} target="_blank" rel="noopener noreferrer" className="blog-url">
              {blog.url}
            </a>
          </div>
          <div className="blog-likes-row">
            <span>likes {blog.likes}</span>
            <button className="btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={() => handleLike(blog)}>
              like
            </button>
          </div>
          {blog.user && (
            <div className="blog-creator">
              added by {blog.user.name || blog.user.username || 'unknown'}
            </div>
          )}
          {showDeleteButton() && (
            <button 
              className="btn-danger" 
              style={{ marginTop: '0.5rem', padding: '0.4rem 0.8rem', fontSize: '0.85rem', width: 'fit-content' }} 
              onClick={() => handleDelete(blog)}
            >
              remove
            </button>
          )}
        </div>
      )}
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  handleLike: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  currentUser: PropTypes.object
}

export default Blog
