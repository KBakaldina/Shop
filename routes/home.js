var express = require('express');
var router = express.Router();

/* GET home page.*/
router.get('/', function(req, res) {
   // console.log(user);
    res.render('home');
});

module.exports = router;