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