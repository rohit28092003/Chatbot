import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    sessions: [{ type: mongoose.Schema.Types.ObjectId, ref: "ChatSession" }],
  },
  { timestamps: true } // Track creation & updates
);

const User = mongoose.model("User", userSchema);
export default User;
