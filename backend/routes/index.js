import { Router } from 'express';
import authRoutes from './auth.js';

const router = Router();

router.use('/auth', authRoutes);

router.get('/', (req, res) => {
    res.json({ message: 'API is working' });
});

export default router;
