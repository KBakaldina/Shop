const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const queryPromise = require('../libs/dbConnection').queryPromise;

/* GET product page. */
router.get('/', (req, res) => {
    passport.authenticate('jwt', {session: false}, async(err, user) => {
        if (user) {
            try {
                let rows = await queryPromise(
                    'SELECT * FROM products WHERE userId=?',
                    jwt.verify(req.cookies.token, process.env.JWT_SECRET).id);
                console.log(rows);
                res.render('products', {rows: rows});
            } catch(err) { res.render('error', {message: 'Ooops...', error: err}); }
        } else if (user == false && err === null) return res.redirect('login');
        else return res.render('error', {message: 'Wow! Something\'s wrong...', error: err});
    })(req, res);
});

module.exports = router;
