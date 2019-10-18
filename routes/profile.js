var express = require('express');
var router = express.Router();
var passport = require('../config/passport');

/* GET profile page.*/
router.get('/', async(ctx, next) => {
    await passport.authenticate('jwt', function(err, user) {
        if (user) {
            ctx.body = "Hello " + user.userName;
        } else {
            ctx.body = "No such user";
            console.log("err", err);
        }
    })(ctx, next)
});

module.exports = router;