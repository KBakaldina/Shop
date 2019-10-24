const express = require('express');
const router = express.Router();
const actionNewProduct = require('../actions/newproduct');
const jwt = require('jsonwebtoken');

/* GET newproduct page. */
router.get('/', (req, res) => {
    if(req.cookies.token)
        res.render('newproduct');
    else res.redirect('login');
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
