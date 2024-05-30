const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    aadhaar_name: {
        type: String,
        required: true
    },
    aadhaar_dob: {
        type: Date,
        required: true
    },
    aadhaar_number: {
        type: Number,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    mobile: {
        type: String
    },
    email: {
        type: String
    },
    address: {
        village: { type: String, required: true },
        post: { type: String, required: true },
        dist: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        pincode: { type: Number, required: true }
    },
    role: {
        type: String,
        enum: ['voter', 'admin'],
        default: 'voter'
    },
    isVoted: {
        type: Boolean,
        default: false
    },
    otp: {
        code: { type: String },
        expiresAt: { type: Date },
    },
    isVerified: {
        type: Boolean,
        default: false
    }

});

userSchema.pre('save', async function (next) {
    const user = this;

    if (!user.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        user.password = hashedPassword;
        next();
    } catch (error) {
        return next(error);
    }
})

userSchema.methods.comparePassword = async function (userPassword) {
    try {
        const isMatch = await bcrypt.compare(userPassword, this.password);
        return isMatch;
    } catch (err) {
        throw err;
    }
}

const User = mongoose.model('User', userSchema);
module.exports = User;