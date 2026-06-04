require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('./models/user')

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  console.error('Please configure MONGODB_URI in your .env file first!')
  process.exit(1)
}

mongoose.set('strictQuery', false)

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB')
    
    // Check if user already exists
    const existing = await User.findOne({ username: 'root' })
    if (existing) {
      console.log('User "root" already exists!')
      mongoose.connection.close()
      return
    }

    const passwordHash = await bcrypt.hash('secretpass', 10)
    const user = new User({
      username: 'root',
      name: 'Kiman Heng',
      passwordHash
    })

    await user.save()
    console.log('------------------------------------------')
    console.log('Created default user successfully!')
    console.log('  Username: root')
    console.log('  Password: secretpass')
    console.log('------------------------------------------')
    mongoose.connection.close()
  })
  .catch(err => {
    console.error('Error connecting to database:', err.message)
  })
