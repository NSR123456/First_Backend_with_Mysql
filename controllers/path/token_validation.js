const { verify } = require("jsonwebtoken");

module.exports = {
    checkToken: (req, res, next) => {
        // Get the token from the "authorization" header
        let token = req.get("authorization");

        // Check if token exists
        if (token) {
            // Remove "Bearer " prefix if it exists
            token = token.startsWith('Bearer ') ? token.slice(7) : token;

            // Verify the token
            verify(token, "qwe1234", (err, decoded) => {
                if (err) {
                    // Invalid token
                    return res.status(401).json({
                        success: 0,
                        message: "Invalid token"
                    });
                } else {
                    // Valid token, proceed to the next middleware
                    next();
                }
            });
        } else {
            // No token provided
            return res.status(403).json({
                success: 0,
                message: "Access denied! Unauthorized user"
            });
        }
    }
};
