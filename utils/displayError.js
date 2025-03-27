const bcrypt = require('bcryptjs');



const johnPassword = 'johndoe';
const peterPassword = 'peterthompson';
const annePassword = 'annesmith';


const johnHash = bcrypt.hashSync(johnPassword, bcrypt.genSaltSync(10));
const peterHash = bcrypt.hashSync(peterPassword, bcrypt.genSaltSync(10));
const anneHash = bcrypt.hashSync(annePassword, bcrypt.genSaltSync(10));


console.log('john hash:', johnHash)
console.log('peter hash:', peterHash)
console.log('anne hash:', anneHash)
