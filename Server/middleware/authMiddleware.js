const jwt = require('jsonwebtoken');

const authorize = (allowedRoles = []) => {
    return (req, res, next) => {
        const token = req.headers['authorization'];
        if (!token) return res.status(403).json({ message: "No token provided" });

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) return res.status(401).json({ message: "Unauthorized" });

            // Role Check
            if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
                return res.status(403).json({ message: "Permission Denied: Access Restricted" });
            }

            req.user = decoded;
            next();
        });
    };
};

module.exports = authorize;