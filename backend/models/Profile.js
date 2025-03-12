import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleId: { type: String },
    todos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Todo" }]
  },
  { timestamps: true } 
);

export default mongoose.model("Profile", ProfileSchema);