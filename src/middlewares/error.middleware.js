const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    // Joi validation error
    if (err.isJoi) {
        return res.status(400).json({
            status: 'error',
            message: err.details[0].message
        });
    }

    const statusCode = err.statusCode || 500;
    
    res.status(statusCode).json({
        status: 'error',
        message: err.message || 'Internal Server Error'
    });
};

module.exports = errorHandler;
