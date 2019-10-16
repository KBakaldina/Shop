var express = require('express');
var router = express.Router();
var actionRegistration = require('../actions/registration');
var bodyParser = require('body-parser');


var urlencodedParser = bodyParser.urlencoded({extended: false});

/* GET registration page.*/
router.get('/', function(req, res) {
    res.render('registration');
});

/* POST registration page.*/
router.post('/', urlencodedParser, function(req, res) {
    console.log(req.body);

    if(req.body.userName && req.body.userPassword && req.body.userPassword2) {
        actionRegistration(req.body.userName, req.body.userPassword, req.body.userPassword2, function(err, resultMsg){
            //if (err) res.send(resultMsg);
            res.send(resultMsg);
            });
    }
    else res.send('All fields (\"Name\", \"Create password\", \"Confirm password\") are required. Please, try again by completing them!');
});

module.exports = router;