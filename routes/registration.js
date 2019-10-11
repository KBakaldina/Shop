var express = require('express');
var router = express.Router();
var bodyParser = require("body-parser");
var actionRegistration= require('../actions/registration');

var urlencodedParser = bodyParser.urlencoded({extended: false});

/* GET registration page.*/
router.get('/', function(req, res) {
    res.render('registration', { title: 'Registration' });
});

/* POST registration page.*/
router.post('/', urlencodedParser, function(req, res) {

    console.log(req.body);

    if(req.body) {
        if ( req.body.userPassword == req.body.userPassword2) {
            res.send('Thank you for registration!');
            actionRegistration(req.body.userName, req.body.userPassword, function(){
            });
        }
        else {
            return res.send('Incorrect conformation of password. Try again, please!')
            //return to registration form
        }
    }
    else  return res.sendStatus(400);

});

module.exports = router;