/**
 * Module dependencies
 */

var jwt = require('./custom-jwt-api/index.js');

/**
 *  Custom middleware for verifying JWT tokens in express
 * 
 * @param {Object} options
 * @param {String|function} [options.secret] - The secret key to sign the token. it can be a string or function (e.g., getting the key from a database or external api)
 * @param {Array<string>} [options.algorithms]
 * @param {String} [options.requestProperty=auth]
 * @param {function} [options.getToken]
 * @returns {function}  - Express middleware function that handles token verification.
 * @example
 * app.use(jwt({
 *     secret: 'your-secret-key',
 *     algorithms: ['HS256'],
 *     requestProperty: 'payload',
 *     getToken: (req) => req.cookies.token
 */

var custom_jwt_middleware = function (options) {

    if (options === void 0 || !options.secret) throw new Error('customJwtMiddleware: `secret` is a required option');
    if (!options.algorithms) throw new Error("customJwtMiddleware: `algorithms` is a required option");
    if (!Array.isArray(options.algorithms)) throw new Error("customJwtMiddleware: `algorithms` must be an array.");
    if (!options.algorithms.includes('HS256')) throw new Error("Only HS256 algorithm is supported in this implementation")

    var getVerificationKey = typeof options.secret === 'function' ?
        options.secret : function () { return Promise.resolve(options.secret) };
    var credentialsRequired = typeof options.credentialsRequired === 'undefined' ? true : options.credentialsRequired;
    var requestProperty = typeof options.requestProperty === 'string' ? options.requestProperty : 'auth';

    var middleware = async function (req, res, next) {

        var token, authorizationHeader, parts, scheme, credentials, decodedToken, key
        authorizationHeader = req.headers && 'Authorization' in req.headers ? 'Authorization' : 'authorization';
        if (options.getToken && typeof options.getToken === 'function') {
            token = options.getToken(req);
        } else if (req.headers && req.headers[authorizationHeader]) {
            parts = req.headers[authorizationHeader].split(' ');
            if (parts.length === 2) {
                scheme = parts[0];
                credentials = parts[1];
                if (/^Bearer/i.test(scheme)) {
                    token = credentials;
                }
                else {
                    if (credentialsRequired) {
                        return next(new Error('Format is Authorization: Bearer [token]'))
                    }
                    else {
                        return next();
                    }
                }
            }
            else {
                return next(new Error('Format is Authorization: Bearer [token]'))
            }
        }
        if (!token) {
            if (credentialsRequired) {
                return next(new Error('No authorization token was found'))

            } else {
                return next();
            }
        }
        decodedToken = void 0;
        try {
            decodedToken = jwt.decode(token, { complete: true })
        } catch (err) {
            console.log(err)
            return next(new Error('Invalid token'))
        }

        // Use getVerificationKey to fetch the secret dynamically

        try {
            key = await getVerificationKey(decodedToken);
            if (!key) return next(new Error('Failed to retrieve secret key'))
            decodedToken = jwt.verify(token, key);
            req[requestProperty] = decodedToken;
            next()
        } catch (err) {
            console.error('JWT verification failed:', err);
            return next(new Error('Invalid token'))

        }
    }
    return middleware
}

exports.custom_jwt_middleware = custom_jwt_middleware;


