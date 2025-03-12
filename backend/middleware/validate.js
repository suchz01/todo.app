import { z } from 'zod';

// const authSchema = z.object({
//   email: z.string().email(),
//   password: z.string().min(6).optional(), 
//   name: z.string().optional(),
//   googleId: z.string().optional(),
//   picture: z.string().optional()
// });

export const validateAuth = (req, res, next) => {
  try {
    if (req.path === '/google') {
      return next();
    }
    const schema = z.object({
      email: z.string().email({ message: "Invalid email format" }),
      password: z.string().min(6, { message: "Password must be at least 6 characters" }),
      name: z.string().min(2, { message: "Name must be at least 2 characters" }).optional()
    });
    schema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({ message: 'Validation error', errors: error.errors });
  }
};

export const validateProfileUpdate = (req, res, next) => {
  try {
    const profileUpdateSchema = z.object({
      name: z.string().min(2, { message: "Name must be at least 2 characters" }).optional(),
      dob: z.string().optional().refine(val => !val || !isNaN(new Date(val).getTime()), {
        message: "Invalid date format"
      }),
      phone: z.string()
        .optional()
        .refine(val => 
          !val || /^(\+91|0)?[6-9]\d{9}$/.test(val), 
          { message: "Invalid phone number" }
        ),        
      bio: z.string().max(500, { message: "Bio cannot exceed 500 characters" }).optional(),
      profilePicture: z.string().url({ message: "Invalid URL format" }).optional(),
      gender: z.enum(['Male', 'Female', 'Other', 'Prefer not to say'], {
        errorMap: () => ({ message: "Invalid gender selection" })
      }).optional()
    });
    
    profileUpdateSchema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({ message: 'Validation error', errors: error.errors });
  }
};

// Password change validation
export const validatePasswordChange = (req, res, next) => {
  try {
    const passwordChangeSchema = z.object({
      currentPassword: z.string().min(6, { message: "Current password must be at least 6 characters" }),
      newPassword: z.string().min(6, { message: "New password must be at least 6 characters" })
        .refine(val => /[A-Z]/.test(val) && /[a-z]/.test(val) && /[0-9]/.test(val), {
          message: "Password must contain at least one uppercase letter, one lowercase letter, and one number"
        }),
      confirmPassword: z.string().min(6, { message: "Confirm password must be at least 6 characters" })
    }).refine(data => data.newPassword === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"]
    });
    
    passwordChangeSchema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({ message: 'Validation error', errors: error.errors });
  }
};

const todoSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  dueDate: z.string().refine(val => !isNaN(new Date(val).getTime()), {
    message: "Invalid date format"
  }),
  priority: z.enum(["Low", "Medium", "High"], {
    errorMap: () => ({ message: "Priority must be Low, Medium, or High" })
  }).default("Low"),
  category: z.string().optional(),
  status: z.enum(["Pending", "In Progress", "Completed"], {
    errorMap: () => ({ message: "Status must be Pending, In Progress, or Completed" })
  }).default("Pending")
});

export const validateTodo = (req, res, next) => {
  try {
    todoSchema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({ message: 'Validation error', errors: error.errors });
  }
};