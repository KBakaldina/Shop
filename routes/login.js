var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var passport = require('../config/passport');
var jwt = require('passport-jwt');
const jwtSecret = 'secret';

/* GET login page.*/
router.get('/', function(req, res) {
    res.render('login');
});

/* POST login page.*/
router.post('/', async(ctx, next) => {
    await passport.authenticate('local-login', {
            successRedirect: '/profile',
            failureRedirect: '/login',
            failureFlash: true },
        function(err, user) {
            if (!user) {
                ctx.body = 'Login failed';
            } else {
                const payload = {
                    id: user.id,
                    userName: user.userName
                };
                const token = jwt.sign(payload, jwtSecret); //здесь создается JWT

                ctx.body = {user: user.displayName, token: 'JWT ' + token};
            }
})(ctx, next)
});

module.exports = router;