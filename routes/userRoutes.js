const express = require('express');
const router = express.Router();
const User = require('../models/UserModel');
const { jwtAuthMiddleware, generateToken } = require('../jwt');

//signup ROUTE
router.post('/signup', async (req, res) => {
    try {
        const data = req.body;

        // Check if there is already an admin user
        const adminUser = await User.findOne({ role: 'admin' });
        if (data.role === 'admin' && adminUser) {
            return res.status(400).json({ error: 'Admin user already exists' });
        }

        // Validate Aadhar Card Number must have exactly 12 digit
        if (!/^\d{12}$/.test(data.aadhaar_number)) {
            return res.status(400).json({ error: 'Aadhar Card Number must be exactly 12 digits' });
        }

        // Check if a user with the same Aadhar Card Number already exists
        const existingUser = await User.findOne({ aadhaar_number: data.aadhaar_number });
        if (existingUser) {
            return res.status(400).json({ error: 'User with the same Aadhar Card Number already exists' });
        }

        // Create a new User document using the Mongoose model
        const newUser = new User(data);
        const response = await newUser.save();
        // console.log('Data saved');
        // const payload = {
        //     id: response.id
        // }
        // const token = generateToken(payload);
        res.status(200).json({ response: response});

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
})

router.post('/login', async (req, res) => {
    try {
        const { aadhaar_number, password } = req.body;
        const user = await User.findOne({ aadhaar_number: aadhaar_number });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid aadhar number or password' });
        }

        const payload = {
            id: user.id
        }
        const token = generateToken(payload);

        res.json({ token });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
    }
});


//profile Route
router.get('/profile', jwtAuthMiddleware, async (req, res) => {
    try {
        const userData = req.user;
        const userId = userData.id;
        const user = await User.findById(userId);
        res.status(200).json({ user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
})

//change password Route
router.put('/profile/password', jwtAuthMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(userId);

        if (!(await user.comparePassword(currentPassword))) {
            return res.status(401).json({ error: 'password not matched' });
        }

        user.password = newPassword;
        await user.save();
        console.log('password changed successfully');
        res.status(200).json({ message: 'Password updated' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
})

module.exports = router;