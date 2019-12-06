const express = require('express');
const router = express.Router();
const passport = require('passport');
const actionShowAllProducts = require('../actions/products/showAll');
const actionLike = require('../actions/products/like');

/* GET shop page. */
router.get('/', (req, res) => {
    passport.authenticate('jwt', {session: false}, async (err, user) => {
        if (user) {
            let isPageOk = true;
            let page = req.query.page;
            if (!page || isNaN(page) || page<1 || page%1!==0)
            {
                page = 1;
                isPageOk = false;
            }
            let order = (req.query.order) ? req.query.order : 'id';
            let desc = (req.query.desc) ? req.query.desc : false;
            let search = (req.query.search) ? req.query.search: '';
            let limit = (req.query.limit) ? req.query.limit : 4;
            let fav = (req.query.fav) ? req.query.fav : false;
            let query = '&search=' + search + '&order=' + order + '&desc=' + desc + '&limit=' + limit + '&fav=' + fav;

            if (isPageOk && req.query.desc && req.query.order && req.query.limit) {
                try {
                    let products = await actionShowAllProducts(user.id, order, desc, search, limit, fav, page);
                    if (page <= products.count) {
                        res.render('products/products', {pageName: 'Shop', linkStart: '/shop', limit: limit,
                            rows: products.rows, currentPage: page, lastPage: products.count, query: query, user: user});
                    } else res.redirect('/shop/?page=1'+query);
                } catch(err) { res.render('error', {error: err}); }
            } else res.redirect('/shop/?page='+page+query);
        } else if (user == false && err === null) return res.redirect('login');
        else return res.render('error', {error: err});
    })(req, res);
});

router.post('/', express.json(), (req, res) => {
    passport.authenticate('jwt', {session: false}, (err, user) => {
        if (user) {
            try {
                req.on('data', async (chunk) => {
                        await actionLike(user.id, parseInt(chunk.toString()));
                        res.statusCode = 200;
                });
            } catch(err) { res.statusCode = err.statusCode; }
        } else if (user == false && err === null) return res.redirect('login');
        else res.statusCode = 404;

        return res.end();
    })(req, res);
});

module.exports = router;