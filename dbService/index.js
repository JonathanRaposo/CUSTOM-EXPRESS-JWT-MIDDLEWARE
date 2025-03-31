/**
 * Module dependencies
 */

const fs = require('fs');
const path = require('path')
const tenantsDatabase = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'database', 'companies.json'), 'utf-8'));
const usersDatabase = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'database', 'users.json'), 'utf-8'));

/**
 * DbService - A Service to interact with the database.
 * 
 * @class DbService
 */

class DbService {
    constructor() {
        this.data = usersDatabase;
        this.tenants = tenantsDatabase;
    }

    /**
     * Finds a user by their unique ID.
     * 
     * @param {String} id
     * @returns {Object|null}
     * @throws {Error}
     */

    async findById(id) {
        try {
            const user = this.data.find((user) => user.id === id);
            return user || null;
        } catch (err) {
            throw new Error(err.message)
        }
    }

    /**
     * Finds a user by specified options (id, email, or name).
     * 
     * @param {Object} options
     * @param {String} [options.id]
     * @param {String} [options.email]
     * @param {String} [options.name]
     * @returns {Object|null}
     * @throws {Error}
     */

    async findOne(options = {}) {
        try {

            if (options.id) {
                return this.findById(options.id)
            }
            if (options.email) {
                const user = this.data.find((user) => user.email.toLowerCase() === options.email.toLowerCase());
                return user || null;
            }
            if (options.name) {
                const user = this.data.find((user) => user.name.toLowerCase() === options.name.toLowerCase());
                return user || null;
            }
            return null;
        } catch (err) {
            throw new Error(err.message)
        }
    }

    /**
     * Finds users based on the specified options (id, email,or name).
     * 
     * @param {Object} options
     * @param {String} [options.id]
     * @param {String} [options.email]
     * @param {String} [options.name]
     * @returns {Array|null}
     * @throws {Error} 
     */

    async find(options = {}) {
        try {
            const { id, email, name } = options;
            if (!id && !email && !name) {
                return this.data;
            }
            if (id) {
                return this.findById(id)
            }
            if (email) {
                const result = this.data.filter((user) => user.email.toLowerCase() === email.toLowerCase());
                return result.length > 0 ? result : null;
            }
            if (name) {
                const result = this.data.filter((user) => user.name.toLowerCase() === name.toLowerCase());
                return result.length > 0 ? result : null;
            }
            return null;
        } catch (err) {
            throw new Error(err.message)
        }
    }

    /**
     * Retrieved the secret key from a issuer` 
     * 
     * @returns {String}
     */

    async getTenantByIdentifier(issuer) {
        const result = this.tenants.find((tenant) => tenant.url === issuer);
        return result || null;
    }
}

module.exports = DbService;