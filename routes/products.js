const express = require('express');
const router = express.Router();

/* GET product page. */
router.get('/', (req, res) => {
    if(req.cookies.token)
        res.render('products');
    else res.redirect('login');
});

module.exports = router;
