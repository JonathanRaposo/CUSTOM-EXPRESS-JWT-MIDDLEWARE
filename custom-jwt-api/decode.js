
const jws = require('./jws/index.js');


module.exports = function (jwt, options) {
    options = options || {};

    const decoded = jws.decode(jwt);
    if (!decoded) { return null };
    let payload = decoded.payload;

    if (typeof payload === 'string') {
        try {
            var obj = JSON.parse(payload);
            if (obj !== null && typeof obj === 'object') {
                payload = obj;
            }
        } catch (err) {
            throw err;
        }
    }

    if (options.complete === true) {
        return {
            header: decoded.header,
            payload: payload,
            signature: decoded.signature
        }
    }
    return payload;

}

