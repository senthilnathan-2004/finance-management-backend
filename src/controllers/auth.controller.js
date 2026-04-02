const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const User = require('../models/user.model');

const registerSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

const updateMeSchema = Joi.object({
    email: Joi.string().email().optional(),
    password: Joi.string().min(6).optional()
}).min(1);


const register = async (req, res, next) => {
    try {
        const { error, value } = registerSchema.validate(req.body);
        if (error) return next(error);

        const { name, email, password } = value;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ status: 'error', message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: 'viewer' // Prevent Privilege Escalation
        });

        await newUser.save();

        res.status(201).json({
            status: 'success',
            message: 'User registered successfully',
            data: { id: newUser._id, name, email, role: newUser.role }
        });
    } catch (err) {
        next(err);
    }
};

const login = async (req, res, next) => {
    try {
        const { error, value } = loginSchema.validate(req.body);
        if (error) return next(error);

        const { email, password } = value;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ status: 'error', message: 'Invalid credentials' });
        }

        if (user.status !== 'active') {
            return res.status(403).json({ status: 'error', message: 'Account is inactive' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ status: 'error', message: 'Invalid credentials' });
        }

        const payload = {
            user: { id: user._id, role: user.role }
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret_key', {
            expiresIn: process.env.JWT_EXPIRES_IN || '24h'
        });

        res.status(200).json({
            status: 'success',
            message: 'Logged in successfully',
            token,
            data: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (err) {
        next(err);
    }
};

const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }
        res.status(200).json({ status: 'success', data: user });
    } catch (err) {
        next(err);
    }
};

const updateMe = async (req, res, next) => {
    try {
        const { error, value } = updateMeSchema.validate(req.body);
        if (error) return next(error);

        const { email, password } = value;

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        if (email) {
            // Check if email is already taken by another user
            const existingUser = await User.findOne({ email });
            if (existingUser && existingUser._id.toString() !== req.user.id) {
                return res.status(400).json({ status: 'error', message: 'Email already in use' });
            }
            user.email = email;
        }

        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();

        res.status(200).json({ 
            status: 'success', 
            message: 'User profile updated successfully',
            data: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (err) {
        next(err);
    }
};

module.exports = { register, login, getMe, updateMe };
