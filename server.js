require('dotenv').config();

const express = require('express');
const app = express();

require('./config/index.js')(app)

const indexRouter = require('./routes/index.js');
app.use('/', indexRouter);


const authRouter = require('./routes/auth.routes.js');
app.use('/', authRouter);


app.use((req, res, next) => {
    res.status(401).render('not-found.hbs')
})


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));