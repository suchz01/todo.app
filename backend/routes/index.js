import { Router } from 'express';
import authRoutes from './auth.js';
import todoRoutes from './todos.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/todos', todoRoutes);


export default router;
