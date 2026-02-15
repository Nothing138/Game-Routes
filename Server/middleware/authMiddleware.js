const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Header theke token nawa
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "No token, authorization denied!" });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // User data request object-e add kora
        next();
    } catch (err) {
        res.status(401).json({ message: "Token is not valid!" });
    }
};