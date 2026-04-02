const mongoose = require('mongoose');

const initDb = async () => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/finance_assessment';
        await mongoose.connect(uri);
        console.log('Connected to MongoDB database');
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1);
    }
};

module.exports = { initDb };
