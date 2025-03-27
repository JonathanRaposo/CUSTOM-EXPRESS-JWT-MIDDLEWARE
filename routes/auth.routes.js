
const ApiService = require('../api-service/api.service.js');
const apiService = new ApiService();
const bcrypt = require('bcryptjs');
const router = require('express').Router();

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
            res.status(200).json({ authToken: payload })
        }
        else {
            res.status(401).json({ errorMessage: 'Incorrect password.' });
        }

    } catch (err) {
        res.status(500).json({ errorMessage: 'Internal Server Error.' })
    }

})
module.exports = router;