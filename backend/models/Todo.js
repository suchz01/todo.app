import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date, required: true },
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Low" }, 
    category: { type: String },
    status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" } 
  },
  { timestamps: true }
);

export default mongoose.model("Todo", TodoSchema);