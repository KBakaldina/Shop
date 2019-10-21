var express = require('express');
var router = express.Router();
const passport = require('passport');

/* GET profile page.*/
router.get('/', (req, res) => {
     passport.authenticate('jwt', function(err, user) {
        if (user) {
            req.body = "Hello " + user.userName;
        } else {
            req.body = "No such user";
            console.log("err", err);
        }
    })(req, res)
});

module.exports = router;