import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Profile from '../models/Profile.js';
import { validateAuth } from '../middleware/validate.js';

const router = Router();

// Register new user
router.post('/register', validateAuth, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // console.log('Registering user:', { name, email }); 
    
    // Check if user already exists
    const existingUser = await Profile.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new Profile({
      name,
      email,
      password: hashedPassword
    });

    await newUser.save();
    // console.log('User created successfully:', newUser._id);

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );

    res.status(201).json({ token });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Server error during registration'
    });
  }
});

// Login user
router.post('/login', validateAuth, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await Profile.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User Not Registered' });
    }

    // Validate password
    const isValidPassword = await bcrypt.compare(password, user.password);
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

export default router;
