const crypto = require('crypto');

const SUPPORTED_ALGS = ['HS256', 'HS384', 'HS512'];
//helper function to encode data in base64url characters;

function base64UrlEncode(data) {
  const jsonString = JSON.stringify(data);
  return Buffer.from(jsonString).toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/\=/g, '');
}

function base64UrlDecode(base64UrlString) {
  return Buffer.from(base64UrlString, 'base64url').toString();
}


// Helper function to parse string durations like '1h', '30m'

function parseTimeSpan(time) {
  if (typeof time === 'number') return time;
  if (typeof time !== 'string') { return null };
  time = time.toLowerCase();

  const match = time.match(/^(\d+)([smhd])$/);
  if (!match) { return null }
  const numericValue = parseInt(match[1], 10);

  const unit = match[2];

  switch (unit) {
    case 's': return numericValue;
    case 'm': return numericValue * 60;
    case 'h': return numericValue * 60 * 60;
    case 'd': return numericValue * 24 * 60 * 60;
    default: return null;
  }
}


module.exports = function (payload, secret, options, callback) {

  if (typeof options === 'function') {
    callback = options;
    options = {};
  } else {
    options = options || {};
  }

  try {

    if (typeof payload !== 'object' || payload === null || payload === undefined) {
      throw new Error('Payload must be a valid object.')
    }
    if (secret === undefined || typeof secret !== 'string') {
      throw new Error('Secret must be provided and must be a string.');
    }


    //clone payload to avoid mutation
    const jwtPayload = { ...payload };
    if (!options.noTimeStamp) {
      jwtPayload.iat = Math.floor(Date.now() / 1000);
    }
    //expiresIn
    let tokenDuration = null;
    if (options.expiresIn) {
      tokenDuration = parseTimeSpan(options.expiresIn);
      if (tokenDuration === null) {
        throw new Error('"expiresIn" should be a number (seconds) or a string like "1h", "30m" "1d".')
      }

    }
    if (tokenDuration !== null) {
      const baseTime = options.noTimeStamp ? Math.floor(Date.now() / 1000) : jwtPayload.iat;
      jwtPayload.exp = baseTime + tokenDuration;
    }
    if (options.sub) {
      if (typeof options.issuer !== 'string') {
        throw new Error(`"sub" should a string (e.g., a user ID).`)
      }
      jwtPayload.sub = options.sub;
    }
    if (options.issuer) {
      if (typeof options.issuer !== 'string') {
        throw new Error(`"issuer" should a string (e.g., http://google.com).`)
      }
      jwtPayload.iss = options.issuer;
    }
    // header with default algorithm
    if (options.algorithm && !SUPPORTED_ALGS.includes(options.algorithm)) {
      throw new Error('Algorithm not suppported.')
    }
    const header = {
      alg: options.algorithm || 'HS256',
      typ: 'JWT'
    }

    const encodedHeader = base64UrlEncode(header);
    const encodedPayload = base64UrlEncode(jwtPayload);

    const encodedSignature = crypto.createHmac('sha256', secret)
      .update(encodedHeader + '.' + encodedPayload)
      .digest('base64url');

    const token = `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
    if (typeof callback === 'function') {
      return callback(null, token);
    }
    return token;


  } catch (err) {
    if (typeof callback === 'function') {
      callback(err, null);
    }
    throw err;
  }

}
