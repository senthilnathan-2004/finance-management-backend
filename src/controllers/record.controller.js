const Record = require('../models/record.model');
const Joi = require('joi');

const recordSchema = Joi.object({
    amount: Joi.number().positive().required(),
    type: Joi.string().valid('income', 'expense').required(),
    category: Joi.string().required(),
    date: Joi.date().iso().required(),
    notes: Joi.string().allow('', null).optional()
});

const querySchema = Joi.object({
    type: Joi.string().valid('income', 'expense').optional(),
    category: Joi.string().optional(),
    startDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().optional(),
    limit: Joi.number().integer().min(1).max(100).default(10),
    offset: Joi.number().integer().min(0).default(0)
});

const createRecord = async (req, res, next) => {
    try {
        const { error, value } = recordSchema.validate(req.body);
        if (error) return next(error);

        const { amount, type, category, date, notes } = value;
        const userId = req.user.id;

        const newRecord = new Record({
            user: userId,
            amount,
            type,
            category,
            date,
            notes
        });

        await newRecord.save();

        res.status(201).json({
            status: 'success',
            message: 'Record created successfully',
            data: newRecord
        });
    } catch (err) {
        next(err);
    }
};

const getRecords = async (req, res, next) => {
    try {
        const { error, value } = querySchema.validate(req.query);
        if (error) return next(error);

        const { type, category, startDate, endDate, limit, offset } = value;

        const filter = {};

        if (type) filter.type = type;
        if (category) filter.category = category;
        if (startDate || endDate) {
            filter.date = {};
            if (startDate) filter.date.$gte = new Date(startDate);
            if (endDate) filter.date.$lte = new Date(endDate);
        }

        const records = await Record.find(filter)
            .sort({ date: -1 })
            .skip(offset)
            .limit(limit);
        
        const total = await Record.countDocuments(filter);

        res.status(200).json({
            status: 'success',
            data: records,
            meta: {
                total,
                limit,
                offset
            }
        });
    } catch (err) {
        next(err);
    }
};

const getRecordById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const record = await Record.findById(id);
        if (!record) {
            return res.status(404).json({ status: 'error', message: 'Record not found' });
        }

        res.status(200).json({ status: 'success', data: record });
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ status: 'error', message: 'Invalid record ID' });
        }
        next(err);
    }
};

const updateRecord = async (req, res, next) => {
    try {
        const { error, value } = recordSchema.validate(req.body);
        if (error) return next(error);

        const { id } = req.params;
        const { amount, type, category, date, notes } = value;

        const record = await Record.findById(id);
        if (!record) {
            return res.status(404).json({ status: 'error', message: 'Record not found' });
        }

        record.amount = amount;
        record.type = type;
        record.category = category;
        record.date = date;
        record.notes = notes;

        await record.save();

        res.status(200).json({ status: 'success', message: 'Record updated successfully', data: record });
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ status: 'error', message: 'Invalid record ID' });
        }
        next(err);
    }
};

const deleteRecord = async (req, res, next) => {
    try {
        const { id } = req.params;

        const record = await Record.findByIdAndDelete(id);
        if (!record) {
            return res.status(404).json({ status: 'error', message: 'Record not found' });
        }

        res.status(200).json({ status: 'success', message: 'Record deleted successfully' });
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ status: 'error', message: 'Invalid record ID' });
        }
        next(err);
    }
};

module.exports = { createRecord, getRecords, getRecordById, updateRecord, deleteRecord };
