import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

dotenv.config()

const app = express()

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173', // Local development
  'http://localhost:3000', // Alternative local port
  'https://insight-matrix-green.vercel.app', // Vercel frontend
  'https://*.vercel.app', // All Vercel preview deployments
]

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true)
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else if (origin.endsWith('.vercel.app')) {
      // Allow all Vercel preview deployments
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

// Middleware
app.use(express.json())

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

// Helper to hash password
const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex')
}

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/insightmatrix'

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message)
    console.error('Connection string:', MONGO_URI)
  })

// Admin Schema (for login/registration)
const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

const Admin = mongoose.model('Admin', adminSchema)

// User Schema (users managed by admin)
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    joinDate: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    adminId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

const User = mongoose.model('User', userSchema)

// Chart Schema
const chartSchema = new mongoose.Schema(
  {
    adminId: {
      type: String,
      required: true,
    },
    chartName: {
      type: String,
      required: true,
    },
    chartType: {
      type: String,
      enum: ['line', 'bar'],
      required: true,
    },
    data: [
      {
        month: String,
        revenue: Number,
        users: Number,
        orders: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
)

const Chart = mongoose.model('Chart', chartSchema)

// Routes

// Sign up endpoint
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' })
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' })
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() })
    if (existingAdmin) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    // Hash password
    const hashedPassword = hashPassword(password)

    // Create new admin
    const newAdmin = new Admin({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    })

    const savedAdmin = await newAdmin.save()

    // Generate JWT token
    const token = jwt.sign(
      {
        id: savedAdmin._id,
        email: savedAdmin.email,
        name: savedAdmin.name,
        role: 'admin',
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(201).json({
      token,
      admin: {
        id: savedAdmin._id,
        email: savedAdmin.email,
        name: savedAdmin.name,
        role: 'admin',
      },
    })
  } catch (error) {
    console.error('Error signing up:', error)
    res.status(500).json({ message: 'Error signing up', error })
  }
})

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    // Find admin by email
    const admin = await Admin.findOne({ email: email.toLowerCase() })
    if (!admin) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    // Check password
    const hashedPassword = hashPassword(password)
    if (admin.password !== hashedPassword) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: 'admin',
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: 'admin',
      },
    })
  } catch (error) {
    console.error('Error logging in:', error)
    res.status(500).json({ message: 'Error logging in', error })
  }
})

// Get all users for an admin
app.get('/api/users/:adminId', async (req, res) => {
  try {
    const { adminId } = req.params
    const users = await User.find({ adminId }).sort({ createdAt: -1 })
    res.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    res.status(500).json({ message: 'Error fetching users', error })
  }
})

// Add a new user
app.post('/api/users', async (req, res) => {
  try {
    const { name, email, joinDate, status, adminId } = req.body

    // Validation
    if (!name || !email || !adminId) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' })
    }

    const newUser = new User({
      name,
      email,
      joinDate: joinDate || new Date().toISOString().split('T')[0],
      status: status || 'active',
      adminId,
    })

    const savedUser = await newUser.save()
    res.status(201).json(savedUser)
  } catch (error) {
    console.error('Error creating user:', error)
    res.status(500).json({ message: 'Error creating user', error })
  }
})

// Get all charts for an admin
app.get('/api/charts/:adminId', async (req, res) => {
  try {
    const { adminId } = req.params
    const charts = await Chart.find({ adminId }).sort({ createdAt: -1 })
    res.json(charts)
  } catch (error) {
    console.error('Error fetching charts:', error)
    res.status(500).json({ message: 'Error fetching charts', error })
  }
})

// Create a new chart
app.post('/api/charts', async (req, res) => {
  try {
    const { adminId, chartName, chartType, data } = req.body

    // Validation
    if (!adminId || !chartName || !chartType || !data || !Array.isArray(data)) {
      return res.status(400).json({ message: 'Missing required fields or invalid data format' })
    }

    if (data.length === 0) {
      return res.status(400).json({ message: 'At least one data point is required' })
    }

    // Validate data entries
    for (const item of data) {
      if (!item.month) {
        return res.status(400).json({ message: 'Each data point must have a month' })
      }
    }

    const newChart = new Chart({
      adminId,
      chartName,
      chartType,
      data,
    })

    const savedChart = await newChart.save()
    res.status(201).json(savedChart)
  } catch (error) {
    console.error('Error creating chart:', error)
    res.status(500).json({ message: 'Error creating chart: ' + error.message })
  }
})

// Update a chart
app.put('/api/charts/:chartId', async (req, res) => {
  try {
    const { chartId } = req.params
    const { chartName, chartType, data } = req.body

    const updatedChart = await Chart.findByIdAndUpdate(
      chartId,
      { chartName, chartType, data },
      { new: true }
    )

    if (!updatedChart) {
      return res.status(404).json({ message: 'Chart not found' })
    }

    res.json(updatedChart)
  } catch (error) {
    console.error('Error updating chart:', error)
    res.status(500).json({ message: 'Error updating chart', error })
  }
})

// Delete a chart
app.delete('/api/charts/:chartId', async (req, res) => {
  try {
    const { chartId } = req.params

    const deletedChart = await Chart.findByIdAndDelete(chartId)

    if (!deletedChart) {
      return res.status(404).json({ message: 'Chart not found' })
    }

    res.json({ message: 'Chart deleted successfully' })
  } catch (error) {
    console.error('Error deleting chart:', error)
    res.status(500).json({ message: 'Error deleting chart', error })
  }
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' })
})

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})


