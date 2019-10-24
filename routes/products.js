const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const queryPromise = require('../libs/dbConnection').queryPromise;

/* GET product page. */
router.get('/', async (req, res) => {
    if(req.cookies.token) {
        try {
            let rows = await queryPromise(
                'SELECT * FROM products WHERE userId=?',
                jwt.verify(req.cookies.token, process.env.JWT_SECRET).id);
            res.render('products', {rows: rows});
        } catch(err) {
            res.render('error', {message: 'Ooops...', error: err});
        }
    } else res.redirect('login');
});

module.exports = router;
