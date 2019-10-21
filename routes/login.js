var express = require('express');
var router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const jwtSecret = 'secret';

/* GET login page.*/
router.get('/', function(req, res) {
    res.render('login');
});

/* POST login page.*/
router.post('/', (req, res) => {
    passport.authenticate('local-login', {
            successRedirect: '/profile',
            failureRedirect: '/login'},
        function(err, user) {
        console.log(req.body);
            if (!user) {
                req.body = 'Login failed';
            } else {
                const payload = {
                    id: user.id,
                    userName: user.userName
                };
                const token = jwt.sign(payload, jwtSecret);

                req.body = {user: user.displayName, token: 'JWT ' + token};
            }
})(req, res);
});

module.exports = router;

//TODO: action/login is not required now??? delete: do.smg;