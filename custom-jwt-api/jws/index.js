

function base64UrlDecode(base64UrlString) {
    return Buffer.from(base64UrlString, 'base64url').toString();
}

function decode(jwt) {

    if (typeof jwt !== 'string' || jwt.split('.').length !== 3) {
        return null;
    }

    const [base64UrlHeader, base64UrlPayload, base64UrlSignature] = jwt.split('.');

    const decodedHeader = base64UrlDecode(base64UrlHeader);
    const decodedPayload = base64UrlDecode(base64UrlPayload);

    return {
        header: JSON.parse(decodedHeader),
        payload: decodedPayload,
        signature: base64UrlSignature
    }
}

module.exports = { decode }
