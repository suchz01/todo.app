import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date },
    dueTime: { type: String },
    priority: { 
      type: String, 
      enum: ["low", "normal", "high", "urgent"], 
      default: "normal" 
    },
    completed: { type: Boolean, default: false },
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    }
  },
  { timestamps: true }
);

export default mongoose.model("Todo", TodoSchema);