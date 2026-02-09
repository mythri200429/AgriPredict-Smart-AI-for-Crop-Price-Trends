const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();
const JWT_SECRET = "MY_SECRET_KEY_123"; // move to env

/* ---------------------- REGISTER USER ------------------------ */

router.post("/register", async (req, res) => {
    try {
        const { name, mobile, email, state, district, crops, password, newPassword } = req.body;

        // Basic validation
        if (!name || !mobile || !email || !state || !district || !password || !newPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password !== newPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        // Check existing user
        const userExists = await User.findOne({ $or: [{ mobile }, { email }] });
        if (userExists) {
            return res.status(400).json({ message: "Mobile or Email already registered" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            mobile,
            email,
            state,
            district,
            crops,
            password: hashedPassword
        });

        await newUser.save();

        res.json({ message: "Registration Successful" });

    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
});

/* ---------------------- LOGIN USER ------------------------ */

router.post("/login", async (req, res) => {
    try {
        const { mobile, password } = req.body;

        const user = await User.findOne({ mobile });
        if (!user) {
            return res.status(400).json({ message: "Invalid Mobile" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ message: "Incorrect Password" });
        }

        const token = jwt.sign(
            { userId: user._id },
            JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            message: "Login Successful",
            token,
            user: {
                name: user.name,
                mobile: user.mobile,
                state: user.state,
                district: user.district,
                crops: user.crops
            }
        });

    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
});

module.exports = router;
