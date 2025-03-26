
const router = require('express').Router();
const ApiService = require('../api-service/api.service.js');
const apiService = new ApiService();

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

    // CHECK IN THE DATABASE IF USER WITH THE SAME EMAIL EXISTS

    const user = await apiService.findOne({ email });
    console.log(user)
    if(!user){
        res.status(401).json({errorMessage: 'User not found.'});
        return;
    }

    // Compare the provided password with the one saved in the database

})
module.exports = router;