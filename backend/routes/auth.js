import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Profile from '../models/Profile.js';
import { validateAuth, validateProfileUpdate, validatePasswordChange } from '../middleware/validate.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

router.post('/register', validateAuth, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const existingUser = await Profile.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new Profile({
      name,
      email,
      password: hashedPassword
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );

    res.status(201).json({ token });
  } catch (error) {
    // console.error(error);
    res.status(500).json({ 
      message: 'Server error during registration'
    });
  }
});

router.post('/login', validateAuth, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Profile.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User Not Registered' });
    }

    const isValidPassword = bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/google', async (req, res) => {
  try {
    const { email, name, googleId } = req.body;

    let user = await Profile.findOne({ email });
    
    if (!user) {
      user = new Profile({
        email,
        name,
        googleId
      });
      await user.save();
    } else if (!user.googleId) {
      user.googleId = googleId;
      await user.save();
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await Profile.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/profile', verifyToken, validateProfileUpdate, async (req, res) => {
  try {
    const updates = req.body;
    if (updates.dob) {
      updates.dob = new Date(updates.dob);
    }
    
    const user = await Profile.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/change-password', verifyToken, validatePasswordChange, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await Profile.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (!user.password) {
      return res.status(400).json({ message: 'Cannot change password for accounts without password' });
    }
    
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    
    await user.save();
    
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
