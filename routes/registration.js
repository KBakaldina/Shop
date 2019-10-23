const express = require('express');
const router = express.Router();
const actionRegistration = require('../actions/registration');

/* GET registration page.*/
router.get('/', (req, res) => {
    res.render('registration');
});

/* POST registration page.*/
router.post('/', async(req, res) => {
    try {
        let resultMsg = await actionRegistration(req.body.userName, req.body.userPassword, req.body.userPassword2);
        res.send(resultMsg);
    } catch(err) {
        res.send(err);
    }
});

module.exports = router;