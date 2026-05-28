import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.model.js';
import Otp from '../models/Otp.model.js';
import sendEmail from '../utils/sendEmail.js';


const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
};

// @desc    Request Registration & Send OTP
// @route   POST /api/auth/request-register
export const requestRegistration = async (req, res) => {
    try {
        const { email } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

        await Otp.deleteMany({ email });

        await Otp.create({ email, otp: otpCode });

        await sendEmail(email, otpCode);

        res.status(200).json({ msg: 'OTP sent successfully to your email.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error', error: error.message });
    }
};

// @desc    Verify OTP & Create Account with Password
// @route   POST /api/auth/verify-register
export const verifyAndRegister = async (req, res) => {
    try {
        const { name, email, password, phone, otp } = req.body;

        const validOtp = await Otp.findOne({ email, otp });
        if (!validOtp) {
            return res.status(400).json({ msg: 'Invalid or expired OTP' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone
        });

        await Otp.deleteMany({ email });

        if (user) {
            const token = generateToken(user._id);
            return res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                token,
            });
        } else {
            return res.status(400).json({ msg: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error', error: error.message });
    }
};

// @desc    Authenticate a user (Login)
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            user.loginHistory.push({ ipAddress: req.ip });
            await user.save();

            const token = generateToken(user._id);

            res.status(200).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                token
            });
        } else {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error', error: error.message });
    }
};