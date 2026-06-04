const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'HTML is easy',
    author: 'Jami K',
    url: 'https://html-easy.com',
    likes: 12
  },
  {
    title: 'Browser can execute only JavaScript',
    author: 'Matti L',
    url: 'https://browser-js.com',
    likes: 4
  }
]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon', url: 'http://temp.com' })
  await blog.save()
  await Blog.findByIdAndDelete(blog._id)
  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb
}
