var express = require('express');
var router = express.Router();

var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({extended: false});

/* GET registration page.*/
router.get('/', function(req, res, next) {
    res.render('registration', { title: 'Registration' });
});

/* POST registration page.*/
router.post('/', function(req, res, next) {
    if(!req.body) return res.sendStatus(400);
    console.log(req.body);
    res.send(`${req.body.userName} - ${req.body.userPassword} - ${req.body.userPassword2}`);
});

module.exports = router;