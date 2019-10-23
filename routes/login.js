const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

/* GET login page.*/
router.get('/', (req, res) => {
    res.render('login');
});

/* POST login page.*/
router.post('/', (req, res) => {
    passport.authenticate('local-login',
        (user, msg) => {
        console.log('user '+user);
        if (user) {
            const payload = {
                id: user.id,
                userName: user.userName
            };
            const token = jwt.sign(payload, 'secret');
            res.cookie('token', token);
            return res.redirect('/profile');
        } else {
            if (user === null && msg === false) msg='All fields (\"Name\", \"Create password\", \"Confirm password\") are required. Please, try again by completing them!';
            return res.send(msg);
        }
})(req, res);
});

module.exports = router;