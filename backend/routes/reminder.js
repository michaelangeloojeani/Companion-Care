const express = require('express');
const router = express.Router();
const Reminder = require('../models/Reminder');
const Pet = require('../models/Pet');
const auth = require('../middleware/auth');

// Get all reminders for user's pets
router.get('/', auth, async (req, res) => {
  try {
    // First get all pets owned by user
    const pets = await Pet.find({ owner: req.userId });
    const petIds = pets.map(pet => pet._id);
    
    // Then get reminders for those pets
    const reminders = await Reminder.find({ petId: { $in: petIds } })
      .populate('petId', 'name photoUrl');
      
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get reminders for a specific pet
router.get('/pet/:petId', auth, async (req, res) => {
  try {
    // Verify pet belongs to user
    const pet = await Pet.findOne({ _id: req.params.petId, owner: req.userId });
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    
    const reminders = await Reminder.find({ petId: req.params.petId });
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new reminder
router.post('/', auth, async (req, res) => {
  try {
    // Verify pet belongs to user
    const pet = await Pet.findOne({ _id: req.body.petId, owner: req.userId });
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    
    const reminder = new Reminder({
      petId: req.body.petId,
      type: req.body.type,
      title: req.body.title,
      description: req.body.description,
      dateTime: new Date(req.body.dateTime),
      isComplete: false
    });

    await reminder.save();
    res.status(201).json(reminder);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update reminder
router.put('/:id', auth, async (req, res) => {
  try {
    // Find the reminder
    const reminder = await Reminder.findById(req.params.id);
    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }
    
    // Verify pet belongs to user
    const pet = await Pet.findOne({ _id: reminder.petId, owner: req.userId });
    if (!pet) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Update fields
    if (req.body.type) reminder.type = req.body.type;
    if (req.body.title) reminder.title = req.body.title;
    if (req.body.description) reminder.description = req.body.description;
    if (req.body.dateTime) reminder.dateTime = new Date(req.body.dateTime);
    if (req.body.isComplete !== undefined) reminder.isComplete = req.body.isComplete;

    await reminder.save();
    res.json(reminder);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete reminder
router.delete('/:id', auth, async (req, res) => {
  try {
    // Find the reminder
    const reminder = await Reminder.findById(req.params.id);
    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }
    
    // Verify pet belongs to user
    const pet = await Pet.findOne({ _id: reminder.petId, owner: req.userId });
    if (!pet) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await Reminder.findByIdAndDelete(req.params.id);
    res.json({ message: 'Reminder deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;