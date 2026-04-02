const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const errorHandler = require('./middlewares/error.middleware');

// Route imports
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const recordRoutes = require('./routes/record.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'success', message: 'API is running' });
});

// Configure routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error Middleware Map
app.use(errorHandler);

module.exports = app;
