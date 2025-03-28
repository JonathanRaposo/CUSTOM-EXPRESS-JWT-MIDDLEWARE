I'm using a dummy database since this app is for authentication demonstration only, using a custom jwt api and a express-jwt middleware.Furthermore, The rest-api uses has ApiService class to interact with the database.

Also, since the users have encrypted passwords,you need to type in thefollowing password if you're using one of these users:

John Doe:
-email: john@gmail.com
-password: john123

Peter Thompson:
-email: peter@gmail.com
-password: peter123

Anne Smith
-email: anne@gmail.com
-password: anne123


const bcrypt = require('bcryptjs');

const john_pass = 'john123';
const peter_pass = 'peter123';
const anne_pass = 'anne123';

const john_hash = bcrypt.hashSync(john_pass, bcrypt.genSaltSync(10))
const peter_hash = bcrypt.hashSync(peter_pass, bcrypt.genSaltSync(10))
const anne_hash = bcrypt.hashSync(anne_pass, bcrypt.genSaltSync(10))

console.log('john hash:', john_hash)
console.log('peter hash:', peter_hash)
console.log('anne hash:', anne_hash)
