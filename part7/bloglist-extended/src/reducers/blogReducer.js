import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload
    },
    appendBlog(state, action) {
      state.push(action.payload)
    },
    updateBlogInList(state, action) {
      const updated = action.payload
      return state.map(b => b.id !== updated.id ? b : updated)
    },
    removeBlogFromList(state, action) {
      const id = action.payload
      return state.filter(b => b.id !== id)
    }
  }
})

export const { setBlogs, appendBlog, updateBlogInList, removeBlogFromList } = blogSlice.actions

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = blogObject => {
  return async dispatch => {
    const newBlog = await blogService.create(blogObject)
    dispatch(appendBlog(newBlog))
    return newBlog
  }
}

export const likeBlog = blog => {
  return async dispatch => {
    const updated = {
      user: blog.user.id || blog.user,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }
    const returnedBlog = await blogService.update(blog.id, updated)
    
    // Restore user details
    if (!returnedBlog.user || typeof returnedBlog.user === 'string') {
      returnedBlog.user = blog.user
    }
    dispatch(updateBlogInList(returnedBlog))
  }
}

export const deleteBlog = id => {
  return async dispatch => {
    await blogService.remove(id)
    dispatch(removeBlogFromList(id))
  }
}

export const commentBlog = (id, comment) => {
  return async dispatch => {
    const returnedBlog = await blogService.addComment(id, comment)
    dispatch(updateBlogInList(returnedBlog))
    return returnedBlog
  }
}

export default blogSlice.reducer
