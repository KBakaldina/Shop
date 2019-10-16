var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var passport = require('../config/passport');

/* GET login page.*/
router.get('/', function(req, res) {
    res.render('login');
});

/* POST login page.*/
router.post('/', passport.authenticate('local-login',{
        successRedirect: '/home',
        failureRedirect: '/login'
}), function(req, res) {
        if(req.body.userName && req.body.userPassword) {
            if(req.body.remember) req.session.cookie.maxAge = 1000 * 60 * 3;
            else req.session.cookie.expires = false;
        } else  res.send('Both fields (\"Name\" and \"Password\") are required. Please, try again by completing them!');
});

module.exports = router;