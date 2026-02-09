const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    mobile: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    state: { type: String, required: true },
    district: { type: String, required: true },
    crops: { type: [String], default: [] }, // multi-select
    password: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
