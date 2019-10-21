var express = require('express');
var router = express.Router();
const passport = require('passport');

/* GET profile page.*/
router.get('/', (req, res) => {
     passport.authenticate('jwt', function(err, user) {
         console.log('user: '+user);
        if (user) {
            res.send = "Hello " + user.userName;
        } else {
            res. send('No such user');
            console.log("err: ", err);
        }
    })(req, res)
});

module.exports = router;