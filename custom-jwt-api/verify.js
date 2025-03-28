const decode = require('./decode.js')
const crypto = require('crypto');

module.exports = function (token, secret, options, callback) {

    if (typeof options === 'function') {
        callback = options;
        options = {}
    }

    if (!options) {
        options = {}
    }

    try {

        if (!token) {
            throw new Error('jwt must be provided');
        }
        if (typeof token !== 'string' || token === null) {
            throw new Error('jwt must be a string')
        }
        if (typeof secret !== 'string') {
            throw new Error('Secret must be provided and must be a string.')
        }
        if (token.split('.').length !== 3) {
            throw new Error('jwt malformed')
        }

        const [base64UrlHeader, base64UrlPayload, base64UrlSignature] = token.split('.');


        const hash = crypto.createHmac('sha256', secret)
            .update(base64UrlHeader + '.' + base64UrlPayload)
            .digest('base64url');

        const isVerified = hash === base64UrlSignature;
        if (!isVerified) {
            throw new Error('Invalid jwt')
        }

        const decoded = decode(token, options)

        const currentTime = Math.floor(Date.now() / 1000);

        if (options.complete) {
            if (decoded.payload.exp && decoded.payload.exp < currentTime) {
                throw new Error('jwt expired.')

            }
        }
        if (decoded.exp && decoded.exp < currentTime) {
            throw new Error('jwt expired.')

        }


        if (typeof callback === 'function') {
            return callback(null, decoded);
        }
        return decoded;

    }
    catch (err) {
        if (typeof callback === 'function') {
            return callback(err, null)
        }
        throw err;
    }
}

