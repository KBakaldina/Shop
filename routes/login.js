var express = require('express');
var router = express.Router();
var actionLogin= require('../actions/login');

var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({extended: false});

/* GET login page.*/
router.get('/', function(req, res) {
    res.render('login', { title: 'Log in' });
});

/* POST login page.*/
router.post('/', urlencodedParser, function(req, res) {

    console.log(req.body);

    if(req.body.userName && req.body.userPassword) {
            actionLogin(req.body.userName, req.body.userPassword, function(err, resultMsg){
                if (err) throw err;
                res.send(resultMsg);
            });

        }
    else  res.send('Both fields (\"Name\" and \"Password\") are required. Please, try again by completing them!');

});

module.exports = router;