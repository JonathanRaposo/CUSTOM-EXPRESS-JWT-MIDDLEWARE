const fs = require('fs');
const path = require('path')

const usersDatabase = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'db', 'users.json'), 'utf-8'));


class ApiService {
    constructor() {
        this.data = usersDatabase;
    }

    async findById(id) {
        try {
            const user = this.data.find((user) => user.id === id);
            return user || null;
        } catch (err) {
            throw new Error(err.message)
        }
    }

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

}

module.exports = ApiService;