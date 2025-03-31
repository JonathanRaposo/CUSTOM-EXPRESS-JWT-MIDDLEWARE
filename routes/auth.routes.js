
const DbService = require('../dbService/index.js');
const dbService = new DbService();
const jwt = require('../custom-jwt-middleware-module/custom-jwt-api/index.js');
const bcrypt = require('bcryptjs');
const router = require('express').Router();

const { isAuthenticated } = require('../middleware/jwt.middleware.js');
const { custom_jwt_middleware: authJWT } = require('../custom-jwt-middleware-module/index.js');
const { loadSecretKey } = require('../utils/loadSecretKey.js');

router.get('/login', (req, res) => {
    res.render('auth/login.hbs');
})

router.post('/login', async (req, res) => {
    console.log(req.body);
    const { email, password } = req.body;

    // CHECK IF EMAIL AND PASSWORD ARE PROVIDED.
    if (!email || !password) {
        res.status(400).json({ errorMessage: 'Enter both, email and password.' });
        return;
    }

    try {
        const user = await dbService.findOne({ email });
        if (!user) {
            res.status(401).json({ errorMessage: 'User not found' });
            return;
        }

        else if (bcrypt.compareSync(password, user.password)) {

            const { id, name, isAdmin } = user;
            const payload = { id, name, isAdmin };

            const token = jwt.sign(
                payload,
                process.env.TOKEN_SECRET,
                { algorithm: 'HS256', expiresIn: '1h', issuer: 'http://jrlinnovations.com' });

            res.status(200).json({ authToken: token })
        }
        else {
            res.status(401).json({ errorMessage: 'Incorrect password.' });
        }

    } catch (err) {
        console.log(err)
        res.status(500).json({ errorMessage: 'Internal Server Error.' })
    }

});

router.get('/user/profile', (req, res) => {
    res.render('users/user-profile.hbs')

});
router.get('/refresh', isAuthenticated, (req, res, next) => {
    console.log(req)
    res.status(200).json(req.payload)
})
// you can configure middleware to allow access to the public
router.get('/public',
    authJWT({ secret: loadSecretKey, algorithms: ['HS256'], credentialsRequired: false }),
    (req, res) => {
        res.render('public-page.hbs')

    })

router.get('/admin', (req, res) => {
    res.render('admin/admin-page.hbs');
})

router.get('/admin/refresh', authJWT({ secret: loadSecretKey, algorithms: ['HS256'] }), (req, res) => {
    console.log(req)
    if (!req.auth.isAdmin) {
        res.status(403).json({ errorMessage: 'Unauthorized. This page is for admin users only.' });
        return;
    }
    res.status(200).json(req.auth)
})



module.exports = router;