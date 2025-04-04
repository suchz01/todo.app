import { Router } from 'express';
import authRoutes from './auth.js';
import todoRoutes from './todos.js';
import userRoutes from './userRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/todos', todoRoutes);
router.use('/users', userRoutes);


export default router;
