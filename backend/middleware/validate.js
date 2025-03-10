import { z } from 'zod';

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional()
});

export const validateAuth = (req, res, next) => {
  try {
    authSchema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({ message: 'Validation error', errors: error.errors });
  }
};

const todoSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  dueDate: z.string().datetime(),
  priority: z.enum(["Low", "Medium", "High"]).default("Low"),
  category: z.string().optional(),
  status: z.enum(["Pending", "In Progress", "Completed"]).default("Pending")
});

export const validateTodo = (req, res, next) => {
  try {
    todoSchema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({ message: 'Validation error', errors: error.errors });
  }
};