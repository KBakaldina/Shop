const express = require('express');
const router = express.Router();
const passport = require('passport');

/* GET profile page.*/
router.get('/', (req, res) => {
    passport.authenticate('jwt', {session: false}, (err, user) => {
        if (user) res.render('profile', {user: user, pageName: 'Profile'});
        else if (user == false && err === null) return res.redirect('login');
        else return res.render('error', {error: err});
    })(req, res);
});

/* POST profile page.*/
router.post('/', (req, res) => {
    res.clearCookie('token');
    res.redirect('login');
});

module.exports = router;