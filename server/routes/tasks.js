// server/routes/tasks.js

const express = require('express');
const Task = require('../models/Task');
const router = express.Router();

// Create a new task
router.post('/', async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get tasks by status
router.get('/status/:status', async (req, res) => {
  try {
    const tasks = await Task.find({ status: req.params.status });
    res.json(tasks);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a task
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Delete a task
router.delete('/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
