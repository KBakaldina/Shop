var express = require('express');
var router = express.Router();
const actionRegistration = require('../actions/registration');

/* GET registration page.*/
router.get('/', function(req, res) {
    res.render('registration');
});

/* POST registration page.*/
router.post('/', function(req, res){
    actionRegistration(req.body.userName, req.body.userPassword, req.body.userPassword2,
        function(err, msg) {
        res.send(msg);
})});

module.exports = router;