import express from 'express';
import Language from '../models/Language.js';

const router = express.Router();

/**
 * @route   GET /api/languages
 * @desc    Get all  supported programming languages
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const languages = await Language.find({ isActive: true })
      .select('name code judge0Id icon extension template')
      .sort({ name: 1 });
    
    res.json({
      success: true,
      count: languages.length,
      languages,
    });
  } catch (error) {
    console.error('Get languages error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch languages' 
    });
  }
});

/**
 * @route   GET /api/languages/:code
 * @desc    Get language by code (python, cpp, c)
 * @access  Public
 */
router.get('/:code', async (req, res) => {
  try {
    const language = await Language.findOne({ 
      code: req.params.code,
      isActive: true 
    });
    
    if (!language) {
      return res.status(404).json({ 
        success: false,
        message: 'Language not found' 
      });
    }
    
    res.json({
      success: true,
      language,
    });
  } catch (error) {
    console.error('Get language error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch language' 
    });
  }
});

export default router;
