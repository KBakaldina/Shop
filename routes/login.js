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
        if (user) {
            const payload = {
                id: user.id,
                userName: user.userName
            };
            const token = jwt.sign(payload, 'secret');
            res.cookie('token', token);
            res.redirect('/profile');
        } else { res.send(msg); }
})(req, res);
});

module.exports = router;