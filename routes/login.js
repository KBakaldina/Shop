var express = require('express');
var router = express.Router();

var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({extended: false});

/* GET login page.*/
router.get('/', function(req, res, next) {
    res.render('login', { title: 'Log in' });
});

/* POST login page.*/
router.post('/', urlencodedParser, function(req, res, next) {
    if(!req.body) return res.sendStatus(400);
    //console.log(req.body);
    //res.send(`${req.body.userName} - ${req.body.userPassword}`);

});

module.exports = router;