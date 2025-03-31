
/**
 * module dependencies
 */

const { custom_jwt_middleware: jwt } = require('../custom-jwt-middleware-module/index.js');
const { loadSecretKey } = require('../utils/loadSecretKey.js');

/**
 * Helper function to extract token from the request header.
 * 
 * @param {Object} req
 * @returns {String|null} 
 */

function getTokenFromHeader(req) {
    let token;
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        token = req.headers.authorization.split(' ')[1];
        return token;
    }
    return null;
}

/**
 * Custom middleware for verifying JWT tokens in express
 * 
 * @param {Object} options
 * @param {String|function} [options.secret]
 *  @param {Array<string>} [options.algorithms]
 * @param {String} [options.requestProperty=auth]
 * @param {function} [options.getToken]
 * @param {Boolean}  [options.credentialsRequired=true]
 * @returns {function}
 */

const isAuthenticated = jwt(
    {
        secret: loadSecretKey,
        algorithms: ['HS256'],
        requestProperty: 'payload',
        getToken: getTokenFromHeader,

    }
)


module.exports = { isAuthenticated }
