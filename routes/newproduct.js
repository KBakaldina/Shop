const express = require('express');
const router = express.Router();
const passport = require('passport');
const actionNewProduct = require('../actions/newproduct');
const jwt = require('jsonwebtoken');

/* GET newproduct page. */
router.get('/', (req, res) => {
    passport.authenticate('jwt', {session: false}, (err, user) => {
        if (user) res.render('newproduct');
        else if (user == false && err === null) return res.redirect('login');
        else return res.render('error', {message: 'Wow! Something\'s wrong...', error: err});
    })(req, res);
});

/* POST newproduct page. */
router.post('/',  async (req, res) => {
    try {
        let resultMsg = await actionNewProduct(
            req.body.productName, req.body.description, req.body.picLink,
            jwt.verify(req.cookies.token, process.env.JWT_SECRET).id);
        res.redirect('/products')
    } catch(err) {
        res.send(err);
    }
});

module.exports = router;
