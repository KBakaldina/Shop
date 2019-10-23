const express = require('express');
const router = express.Router();
const actionRegistration = require('../actions/registration');

/* GET registration page.*/
router.get('/', (req, res) => {
    res.render('registration');
});

/* POST registration page.*/
router.post('/', (req, res) => {
    actionRegistration(req.body.userName, req.body.userPassword, req.body.userPassword2,
        (err, msg) => {
        res.send(msg);
})});

module.exports = router;