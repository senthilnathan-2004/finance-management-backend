const User = require('../models/user.model');
const Joi = require('joi');

const updateRoleSchema = Joi.object({
    role: Joi.string().valid('viewer', 'analyzer', 'admin').required()
});

const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({}, '-password'); // exclude password
        res.status(200).json({ status: 'success', data: users });
    } catch (err) {
        next(err);
    }
};

const updateUserRole = async (req, res, next) => {
    try {
        const { error, value } = updateRoleSchema.validate(req.body);
        if (error) return next(error);

        const { id } = req.params;
        const { role } = value;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        user.role = role;
        await user.save();

        res.status(200).json({ status: 'success', message: 'User role updated successfully' });
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ status: 'error', message: 'Invalid user ID' });
        }
        next(err);
    }
};

const toggleUserStatus = async (req, res, next) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        const newStatus = user.status === 'active' ? 'inactive' : 'active';
        user.status = newStatus;
        await user.save();

        res.status(200).json({ status: 'success', message: `User status updated to ${newStatus}` });
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ status: 'error', message: 'Invalid user ID' });
        }
        next(err);
    }
};

module.exports = { getAllUsers, updateUserRole, toggleUserStatus };
