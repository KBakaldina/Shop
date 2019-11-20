const express = require('express');
const router = express.Router();
const passport = require('passport');
const upload = require('../libs/multer');

const actionSharpPic = require('../actions/products/sharp');
const actionShowProducts = require('../actions/products/show');
const actionVerifyProduct =require('../actions/products/verify');
const actionAddProduct = require('../actions/products/add');
const actionEditProduct = require('../actions/products/edit');
const actionDeleteProduct = require('../actions/products/delete');

/* GET product page. */
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
            let search = (req.query.search) ? req.query.search : '';
            let limit = (req.query.limit) ? req.query.limit : 4;
            let query = '&search=' + search + '&order=' + order + '&desc=' + desc + '&limit=' + limit;

            if (isPageOk && req.query.desc && req.query.order && req.query.limit) {
                try {
                    let products = await actionShowProducts(user.id, order, desc, search, limit, page);
                    if (page <= products.count || products.count == 0) {
                        res.render('products/products', {pageName: 'My products', linkStart: '/products',
                            rows: products.rows, limit: limit,
                            currentPage: page, lastPage: products.count, query: query});
                    } else res.redirect('/products/?page=1'+query);
                } catch(err) { res.render('error', {message: 'Ooops...', error: err}); }
            } else res.redirect('/products/?page='+page+query);
        } else if (user == false && err === null) return res.redirect('login');
        else return res.render('error', {message: 'Wow! Something\'s wrong...', error: err});
    })(req, res);
});

/* GET add new product page. */
router.get('/add', (req, res) => {
    passport.authenticate('jwt', {session: false}, (err, user) => {
        if (user) res.render('products/add');
        else if (user == false && err === null) return res.redirect('login');
        else return res.render('error', {message: 'Wow! Something\'s wrong...', error: err});
    })(req, res);
});

/* POST add new product page. */
router.post('/add', upload.single('pictureFile'), (req, res) => {
    passport.authenticate('jwt', {session: false}, async (err, user) => {
        if (user) {
            try {
                let pictureLink = await actionSharpPic(req.file.path);
                await actionAddProduct(req.body.productName, req.body.price, req.body.description,
                    pictureLink, user.id);
                res.redirect('/products')
            } catch(err) { res.render('error', {message: 'Ooops...', error: err}); }
        } else if (user == false && err === null) return res.redirect('login');
        else return res.render('error', {message: 'Wow! Something\'s wrong...', error: err});
    })(req, res);
});

/* GET edit product page. */
router.get('/edit/:id', (req, res) => {
    passport.authenticate('jwt', {session: false}, async (err, user) => {
        if (user) {
            try {
                let product = await actionVerifyProduct(req.params.id, user.id);
                if (product)
                    res.render('products/edit', {product: product});
                else res.send('This is not your product!');
            } catch(err) { res.render('error', {message: 'Ooops...', error: err}); }
        } else if (user == false && err === null) return res.redirect('login');
        else return res.render('error', {message: 'Wow! Something\'s wrong...', error: err});
    })(req, res);
});

/* POST edit product page. */
router.post('/edit/:id', upload.single('pictureFile'), (req, res) => {
    passport.authenticate('jwt', {session: false}, async (err, user) => {
        if (user) {
            try {
                let product = await actionVerifyProduct(req.params.id, user.id);
                if (product) {
                    let pictureLink = (req.file)? await actionSharpPic(req.file.path): null;
                    await actionEditProduct(req.params.id, req.body.productName, req.body.price, req.body.description, pictureLink);
                    res.redirect('/products');
                    } else res.send('This is not your product! You can change only your products.');
            } catch(err) { res.render('error', {message: 'Ooops...', error: err}); }
        } else if (user == false && err === null) return res.redirect('login');
        else return res.render('error', {message: 'Wow! Something\'s wrong...', error: err});
    })(req, res);
});

/* POST delete product page. */
router.get('/delete/:id', (req, res) => {
    passport.authenticate('jwt', {session: false}, async (err, user) => {
        if (user) {
            try {
                let product = await actionVerifyProduct(req.params.id, user.id);
                if (product) {
                    await actionDeleteProduct(req.params.id);
                    res.redirect('/products');
                } else res.send('This is not your product! You can delete only your products.');
            } catch(err) { res.render('error', {message: 'Ooops...', error: err}); }
        } else if (user == false && err === null) return res.redirect('login');
        else return res.render('error', {message: 'Wow! Something\'s wrong...', error: err});
    })(req, res);
});

module.exports = router;
