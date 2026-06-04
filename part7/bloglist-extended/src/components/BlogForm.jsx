import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleAddBlog = (event) => {
    event.preventDefault()
    createBlog({
      title,
      author,
      url
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div className="card">
      <h3>Create new blog</h3>
      <form onSubmit={handleAddBlog}>
        <div>
          <label>Title</label>
          <input
            id="title-input"
            type="text"
            value={title}
            name="Title"
            placeholder="Title of the blog"
            onChange={({ target }) => setTitle(target.value)}
            required
          />
        </div>
        <div>
          <label>Author</label>
          <input
            id="author-input"
            type="text"
            value={author}
            name="Author"
            placeholder="Author of the blog"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          <label>URL</label>
          <input
            id="url-input"
            type="text"
            value={url}
            name="URL"
            placeholder="URL of the blog"
            onChange={({ target }) => setUrl(target.value)}
            required
          />
        </div>
        <button id="create-blog-btn" className="btn-primary" type="submit">create</button>
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default BlogForm
