require('dotenv').config();
const app = require('./app');
const { initDb } = require('./config/db');
const seedAdminAndAnalyzer = require('./seed/user.seeder');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await initDb();
        await seedAdminAndAnalyzer();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
