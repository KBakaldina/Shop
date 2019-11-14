const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('forgot', {pageName: 'Forgot password'});
});

router.post('/', (req, res) => {
    console.log(req.body);
    //generate token
    //save it into db
    //send email with the link with token
    res.send('Check your email!');
});

router.post('/:token', (req, res) => {
    console.log(req.params.token);
    //check token from db
    //if ok render page to change password
    //action changePassword
    res.send('ok');
});

module.exports = router;