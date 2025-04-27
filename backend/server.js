const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config()


const authRoutes = require('./routes/auth');
const petRoutes = require('./routes/pets');
const reminderRoutes = require('./routes/reminders');

// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));
  
  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/pets', petRoutes);
  app.use('/api/reminders', reminderRoutes);