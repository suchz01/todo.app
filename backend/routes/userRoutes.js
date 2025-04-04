import express from 'express';
import upload from '../middleware/multer.js';
import cloudinary from '../utils/cloudinary.js';
import fs from 'fs';
import { verifyToken } from '../middleware/auth.js';
import Profile from '../models/Profile.js';

const router = express.Router();

router.post('/profile-picture', verifyToken, upload.single('profilePicture'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
        
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: `profile_pictures/${req.user.id}`,
            width: 500,
            height: 500,
            crop: 'fill',
            overwrite: true
        });

        fs.unlinkSync(req.file.path); // Clean up local file

        const updatedUser = await Profile.findByIdAndUpdate(req.user.id, { profilePicture: result.secure_url }, { new: true });
        
        res.json({ success: true, message: 'Profile picture updated', profilePicture: result.secure_url });
    } catch (error) {
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path); 
        res.status(500).json({ success: false, message: 'Error uploading profile picture', error: error.message });
    }
});

export default router;
