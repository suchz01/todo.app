import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleId: { type: String },
    dob: { type: Date },
    phone: { type: String },
    bio: { type: String },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    todos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Todo" }],
    profilePicture: {
      type: String,
      default:
        "https://static.vecteezy.com/system/resources/previews/020/911/740/non_2x/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.png",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Profile", ProfileSchema);
