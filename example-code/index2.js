const crypto = require('crypto');

// Base64Url encoding and decoding functions
function base64UrlEncode(input) {
    return Buffer.from(input).toString('base64url');
}

function base64UrlDecode(input) {
    return Buffer.from(input, 'base64url').toString();
}

// JWT verification function (mimicking jsonwebtoken.verify)
function verifyJwt(token, secret) {
    if (!token) throw new Error('Token not provided');

    const [encodedHeader, encodedPayload, encodedSignature] = token.split('.');

    if (!encodedHeader || !encodedPayload || !encodedSignature) {
        throw new Error('Invalid token format');
    }

    const header = JSON.parse(base64UrlDecode(encodedHeader));

    if (header.alg !== 'HS256') {
        throw new Error('Unsupported algorithm');
    }

    const signatureBase = `${encodedHeader}.${encodedPayload}`;
    const expectedSignature = crypto.createHmac('sha256', secret).update(signatureBase).digest('base64');


    if (expectedSignature !== encodedSignature) {
        throw new Error('Invalid token signature');
    }

    const payload = JSON.parse(base64UrlDecode(encodedPayload));

    // Check expiration time
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        throw new Error('Token has expired');
    }

    return payload;
}

// Custom express-jwt middleware
function expressJwt(options) {
    if (!options.secret) throw new Error('Secret key is required');

    if (!options.algorithms) {
        options.algorithms = ['HS256']
    }
    if (!options.requestProperty) {
        options.requestProperty = 'payload'
    }
    if (!Array.isArray(options.algorithms) || !options.algorithms.includes('HS256')) {
        throw new Error('Only HS256 algorithm is supported in this implementation');
    }

    return (req, res, next) => {
        try {
            const token = options.getToken(req);
            if (!token) {
                return res.status(401).json({ error: 'Unauthorized: No token provided' });
            }

            const decoded = verifyJwt(token, options.secret);
            req[options.requestProperty] = decoded;
            next();
        } catch (err) {
            return res.status(401).json({ error: `Unauthorized: ${err.message}` });
        }
    };
}

// Function to extract the token from Authorization header
function getTokenFromHeaders(req) {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        return req.headers.authorization.split(' ')[1];
    }
    return null;
}

// Example Express app usage
const express = require('express');
const app = express();

// Middleware setup
const isAuthenticated = expressJwt({
    secret: 'mySecretKey',
    algorithms: ['HS256'],
    requestProperty: 'payload',
    getToken: getTokenFromHeaders,
});

// Protected route
app.get('/protected', isAuthenticated, (req, res) => {
    res.json({ message: 'You have accessed a protected route', user: req.payload });
});

// Start the server
app.listen(3000, () => console.log('Server running on port 3000'));
