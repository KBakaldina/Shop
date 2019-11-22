const express = require('express');
const router = express.Router();
const passport = require('passport');
const actionLoginToken = require('../actions/loginToken')

/* GET login page.*/
router.get('/', (req, res) => {
    res.render('login');
});

/* POST login page.*/
router.post('/', (req, res) => {
    passport.authenticate('local-login',
        (user, msg) => {
        if (user) {
            res.cookie('token', actionLoginToken(user.id, user.userName));
            res.redirect('/profile');
        } else { res.send(msg); }
})(req, res);
});

/* GET FB-login page.*/
router.get('/facebook', passport.authenticate("facebook",{scope:"email"}));

router.get('/facebook/callback', (req, res) => {
    passport.authenticate('facebook',
        (user, msg) => {
        if (user) {
            res.cookie('token', actionLoginToken(user.id, user.userName));
            res.redirect('/profile');
        } else { res.send(msg); }
    })(req, res);
});

module.exports = router;