var express = require('express');
var router = express.Router();
var passport = require('../config/passport');

/* GET registration page.*/
router.get('/', function(req, res) {
    res.render('registration');
});

/* POST registration page.*/
router.post('/', async(ctx, next) => {
    await passport.authenticate('local-registration', {
        successRedirect: '/profile',
        failureRedirect: '/registration',
        failureFlash: true
})});

module.exports = router;