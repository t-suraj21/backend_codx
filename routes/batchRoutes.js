import express from 'express';
import Batch from '../models/Batch.js';
import User from '../models/User.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /batches - Get all batches
router.get('/', authMiddleware, async (req, res) => {
  try {
    const batches = await Batch.find()
      .populate('students', 'name email points accuracy')
      .sort({ startDate: -1 });
    
    res.json(batches);
  } catch (error) {
    console.error('Error fetching batches:', error);
    res.status(500).json({ error: 'Failed to fetch batches' });
  }
});

// GET /batches/:id - Get batch by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id)
      .populate('students', 'name email points accuracy');
    
    if (!batch) {
      return res.status(404).json({ error: 'Batch not found' });
    }
    
    res.json(batch);
  } catch (error) {
    console.error('Error fetching batch:', error);
    res.status(500).json({ error: 'Failed to fetch batch' });
  }
});

// GET /batches/:id/leaderboard - Get batch leaderboard
router.get('/:id/leaderboard', authMiddleware, async (req, res) => {
  try {
    // BUG FIX: Mongoose .populate() does NOT support `options: { sort }` on populated docs.
    // Sort the array in JS after population instead.
    const batch = await Batch.findById(req.params.id)
      .populate('students', 'name email points accuracy totalSolved streak avatar');

    if (!batch) {
      return res.status(404).json({ error: 'Batch not found' });
    }

    // Sort by points descending, then assign rank
    const sorted = [...batch.students].sort((a, b) => (b.points || 0) - (a.points || 0));
    const studentsWithRank = sorted.map((student, index) => ({
      ...student.toObject(),
      rank: index + 1,
    }));

    res.json({
      success: true,
      batchName: batch.name,
      students: studentsWithRank,
    });
  } catch (error) {
    console.error('Error fetching batch leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch batch leaderboard' });
  }
});

// POST /batches - Create a new batch (admin only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, description, startDate, endDate, studentIds } = req.body;
    
    const batch = new Batch({
      name,
      description,
      startDate,
      endDate,
      students: studentIds || [],
    });
    
    await batch.save();
    res.status(201).json(batch);
  } catch (error) {
    console.error('Error creating batch:', error);
    res.status(500).json({ error: 'Failed to create batch' });
  }
});

// PUT /batches/:id/students - Add students to batch
router.put('/:id/students', authMiddleware, async (req, res) => {
  try {
    const { studentIds } = req.body;
    
    const batch = await Batch.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { students: { $each: studentIds } } },
      { new: true }
    ).populate('students', 'name email points accuracy');
    
    if (!batch) {
      return res.status(404).json({ error: 'Batch not found' });
    }
    
    res.json(batch);
  } catch (error) {
    console.error('Error adding students to batch:', error);
    res.status(500).json({ error: 'Failed to add students to batch' });
  }
});

export default router;
