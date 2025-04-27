const express = require('express');
const router = express.Router();
const Pet = require('../models/Pet');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function(req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed'));
  }
});

// Get all pets for current user
router.get('/', auth, async (req, res) => {
  try {
    const pets = await Pet.find({ owner: req.userId });
    res.json(pets);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single pet by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const pet = await Pet.findOne({ _id: req.params.id, owner: req.userId });
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    res.json(pet);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new pet
router.post('/', auth, upload.single('photo'), async (req, res) => {
  try {
    const photoUrl = req.file ? `/uploads/${req.file.filename}` : null;
    
    const pet = new Pet({
      name: req.body.name,
      species: req.body.species,
      breed: req.body.breed,
      gender: req.body.gender,
      dob: req.body.dob,
      weight: req.body.weight,
      photoUrl,
      owner: req.userId
    });

    await pet.save();
    res.status(201).json(pet);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update pet
router.put('/:id', auth, upload.single('photo'), async (req, res) => {
  try {
    let pet = await Pet.findOne({ _id: req.params.id, owner: req.userId });
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    // Update fields
    pet.name = req.body.name || pet.name;
    pet.species = req.body.species || pet.species;
    pet.breed = req.body.breed || pet.breed;
    pet.gender = req.body.gender || pet.gender;
    pet.dob = req.body.dob || pet.dob;
    pet.weight = req.body.weight || pet.weight;
    
    // Update photo if provided
    if (req.file) {
      pet.photoUrl = `/uploads/${req.file.filename}`;
    }

    await pet.save();
    res.json(pet);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete pet
router.delete('/:id', auth, async (req, res) => {
  try {
    const pet = await Pet.findOneAndDelete({ _id: req.params.id, owner: req.userId });
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    res.json({ message: 'Pet deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;