import { Router } from 'express';
import Todo from '../models/Todo.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

router.get('/', verifyToken, async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.user.id });
    // console.log("Todos:", todos);
    res.status(200).json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', verifyToken, async (req, res) => {
  try {
    const todo = await Todo.findOne({ 
      _id: req.params.id,
      userId: req.user.id 
    });
    
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    
    res.status(200).json(todo);
  } catch (error) {
    console.error('Error fetching todo:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, description, dueDate, dueTime, priority } = req.body;
    const newTodo = new Todo({
      title,
      description,
      dueDate,
      dueTime,
      priority,
      completed: false,
      userId: req.user.id
    });
    
    const savedTodo = await newTodo.save();
    // console.log('Saved todo:', savedTodo);
    res.status(201).json(savedTodo);
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  try {    
    const todo = await Todo.findOne({ 
      _id: req.params.id,
      userId: req.user.id 
    });
    
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    
    const updates = {};
    if (req.body.title !== undefined) updates.title = req.body.title;
    if (req.body.description !== undefined) updates.description = req.body.description;
    if (req.body.dueDate !== undefined) updates.dueDate = req.body.dueDate;
    if (req.body.dueTime !== undefined) updates.dueTime = req.body.dueTime;
    if (req.body.priority !== undefined) updates.priority = req.body.priority;
    if (req.body.completed !== undefined) updates.completed = req.body.completed;
    
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true }
    );
    
    // console.log('Updated todo:', updatedTodo);
    res.status(200).json(updatedTodo);
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const todo = await Todo.findOne({ 
      _id: req.params.id,
      userId: req.user.id 
    });
    
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    
    await Todo.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 