const express = require('express');
const router = express.Router();
const passport = require('passport');
const actionShowAllProducts = require('../actions/products/show');
const actionLike = require('../actions/products/like');

/* GET shop page. */
router.get('/', (req, res) => {
    passport.authenticate('jwt', {session: false}, async (err, user) => {
        if (user) {
            let page = (req.query.page) ? req.query.page : 1;
            let order = (req.query.order) ? req.query.order : 'id';
            let desc = (req.query.desc) ? req.query.desc : false;
            let search = (req.query.search) ? req.query.search: '';
            let query = '&search=' + search + '&order=' + order + '&desc=' + desc;

            if (req.query.page && req.query.desc && req.query.order) {
                try {
                    let products = await actionShowAllProducts (user.id, order, desc, search, page, true);
                    res.render('products/products', {pageName: 'Shop', rows: products.rows, limit: products.limit,
                        currentPage: page, lastPage: products.count, query: query});
                } catch(err) { res.render('error', {message: 'Ooops...', error: err}); }
            } else res.redirect('/shop/?page='+page+query);
        } else if (user == false && err === null) return res.redirect('login');
        else return res.render('error', {message: 'Wow! Something\'s wrong...', error: err});
    })(req, res);
});

router.post('/', (req, res) => {
    passport.authenticate('jwt', {session: false}, async (err, user) => {
        if (user) {
            try {
                await actionLike(user.id, parseInt(req.query.id));
            } catch(err) { res.render('error', {message: 'Ooops...', error: err}); }
        } else if (user == false && err === null) return res.redirect('login');
        else return res.render('error', {message: 'Wow! Something\'s wrong...', error: err});
    })(req, res);
});

module.exports = router;