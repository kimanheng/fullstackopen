const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

// GET all blogs
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

// POST a new blog
blogsRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user

  if (!user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  if (!body.title || !body.url) {
    return response.status(400).json({ error: 'title or url is missing' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes === undefined ? 0 : body.likes,
    user: user.id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  // Populate user data before returning
  const populatedBlog = await Blog.findById(savedBlog.id).populate('user', { username: 1, name: 1 })
  response.status(201).json(populatedBlog)
})

// DELETE a blog
blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user

  if (!user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  if (blog.user.toString() !== user.id.toString()) {
    return response.status(403).json({ error: 'only the creator can delete this blog' })
  }

  await Blog.findByIdAndDelete(request.params.id)
  
  // Remove blog reference from user's blogs array
  user.blogs = user.blogs.filter(b => b.toString() !== request.params.id)
  await user.save()

  response.status(204).end()
})

// PUT (update) a blog (likes, etc.)
blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body

  const blog = {
    title,
    author,
    url,
    likes: likes || 0
  }

  const updatedBlog = await Blog
    .findByIdAndUpdate(request.params.id, blog, { new: true, runValidators: true, context: 'query' })
    .populate('user', { username: 1, name: 1 })

  if (updatedBlog) {
    response.json(updatedBlog)
  } else {
    response.status(404).end()
  }
})

// POST comment on a blog (FSO Part 7 assignment requirement)
blogsRouter.post('/:id/comments', async (request, response) => {
  const { comment } = request.body

  if (!comment) {
    return response.status(400).json({ error: 'comment content is missing' })
  }

  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  blog.comments = blog.comments.concat(comment)
  const savedBlog = await blog.save()
  
  const populatedBlog = await Blog.findById(savedBlog.id).populate('user', { username: 1, name: 1 })
  response.status(201).json(populatedBlog)
})

module.exports = blogsRouter
