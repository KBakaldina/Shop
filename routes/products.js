const express = require('express');
const router = express.Router();

/* GET product page. */
router.get('/', (req, res) => {
    res.render('products');
});

/* POST product page. */
router.post('/', (req, res) => {
    //
});

module.exports = router;
