
const ApiService = require('../api-service/api.service.js');
const apiService = new ApiService();
const jwt = require('../custom-jwt-api/index.js');
const bcrypt = require('bcryptjs');
const router = require('express').Router();

const isAuthenticated = require('../middleware/option-2.js');

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
        const user = await apiService.findOne({ email });
        console.log('user from DB:', user)
        if (!user) {
            res.status(401).json({ errorMessage: 'User not found' });
            return;
        }

        else if (bcrypt.compareSync(password, user.password)) {

            const { id, name, email } = user;
            const payload = { id, name, email };

            const token = jwt.sign(
                payload,
                process.env.TOKEN_SECRET,
                { algorithm: 'HS256', expireIn: '1h' });

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
router.get('/refresh', isAuthenticated, (req, res) => {
    res.status(200).json(req.payload)
})

module.exports = router;