const express = require('express');
const router = express.Router();

/* GET newproduct page. */
router.get('/', (req, res) => {
    res.render('newproduct');
});

module.exports = router;
