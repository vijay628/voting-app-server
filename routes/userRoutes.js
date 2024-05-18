const express = require('express');
const router = express.Router();
const User = require('../models/UserModel');
const { jwtAuthMiddleware, generateToken } = require('../jwt');

//signup rOUTE
router.post('/signup', async (req, res) => {
    try {
        const data = req.body;
        const newUser = new User(data);
        const response = await newUser.save();
        console.log('Data saved');
        const payload = {
            id: response.id
        }
        const token = generateToken(payload);
        res.status(200).json({ response: response, token: token });

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