const express = require('express');
const router = express.Router();
const passport = require('passport');
const actionShowProducts = require('../actions/products/show');
const actionLike = require('../actions/products/like');

/* GET shop page. */
router.get('/', (req, res) => {
    passport.authenticate('jwt', {session: false}, async (err, user) => {
        if (user) {
            let page = (req.query.page) ? req.query.page : 1;
            let order = (req.query.order) ? req.query.order : 'id';
            let desc = (req.query.desc) ? req.query.desc : false;
            let search = (req.query.search) ? req.query.search: '';
            let limit = (req.query.limit) ? req.query.limit : 4;
            let query = '&search=' + search + '&order=' + order + '&desc=' + desc + '&limit=' + limit;

            if (req.query.page && req.query.desc && req.query.order && req.query.limit) {
                try {
                    let products = await actionShowProducts (user.id, order, desc, search, limit, page, 'shop');
                    res.render('products/products', {pageName: 'Shop', linkStart: '/shop', rows: products.rows, limit: limit,
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