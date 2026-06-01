import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.model.js';


const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
};

const buildAuthResponse = (user) => ({
    user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        shopName: user.shopName,
        address: user.address
    },
    token: generateToken(user._id),
});

// @desc    Create a new account
// @route   POST /api/auth/register
export const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone, shopName, address } = req.body;

        if (!name || !email || !password || !shopName || !address) {
            return res.status(400).json({ msg: 'Name, email, password, shop name, and address are required' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
            shopName,
            address
        });

        if (user) {
            return res.status(201).json(buildAuthResponse(user));
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

            res.status(200).json(buildAuthResponse(user));
        } else {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error', error: error.message });
    }
};
