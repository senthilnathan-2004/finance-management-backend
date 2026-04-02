const User = require('../models/user.model');
const bcrypt = require('bcrypt');

const seedAdminAndAnalyzer = async () => {
    try {
        const adminEmail = 'admin@gmail.com';
        const analyzerEmail = 'analyzer@gmail.com';

        // Check if accounts exist based on roles
        const adminExists = await User.findOne({ role: 'admin' });
        const analyzerExists = await User.findOne({ role: 'analyzer' });

        if (!adminExists) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('Admin123!', salt);
            await User.create({
                name: 'System Admin',
                email: adminEmail,
                password: hashedPassword,
                role: 'admin'
            });
            console.log(' Default Admin account created successfully');
        } else {
            console.log(' Admin account already exists, skipping seed...');
        }

        if (!analyzerExists) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('Analyzer123!', salt);
            await User.create({
                name: 'System Analyzer',
                email: analyzerEmail,
                password: hashedPassword,
                role: 'analyzer'
            });
            console.log(' Default Analyzer account created successfully');
        } else {
            console.log(' Analyzer account already exists, skipping seed...');
        }

    } catch (error) {
        console.error(' Error seeding default accounts:', error);
    }
};

module.exports = seedAdminAndAnalyzer;
