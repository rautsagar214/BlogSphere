import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    date: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Blog", BlogSchema);