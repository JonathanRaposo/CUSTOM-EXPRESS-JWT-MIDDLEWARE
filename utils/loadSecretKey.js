
/**
 * dependencies
 */

const DbService = require('../dbService/index.js');
const dbService = new DbService();

/**
 * Helper function to get secret key from api
 * 
 * @param {Object} decodedToken   - parsed token with its header and payload.
 * @returns {Promise<String>}     - Returns secret key dynamically.
 * @throws {Error}
 */

exports.loadSecretKey = async function (decodedToken) {
    var issuer, tenant
    issuer = decodedToken.payload.iss;
    tenant = await dbService.getTenantByIdentifier(issuer);
    console.log('tentant:', tenant)
    if (!tenant) {
        throw new Error('no secret key found.')
    }
    return tenant.secret_key;

}


