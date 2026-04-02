const roleMiddleware = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(403).json({ status: 'error', message: 'User role context missing' });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                status: 'error', 
                message: `Forbidden: Access requires one of the following roles: ${allowedRoles.join(', ')}`
            });
        }
        
        next();
    };
};

module.exports = roleMiddleware;
