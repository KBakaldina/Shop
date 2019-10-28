const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const queryPromise = require('../libs/dbConnection').queryPromise;
const actionAddProduct = require('../actions/products/add');
const actionEditProduct = require('../actions/products/edit');
const actionDeleteProduct = require('../actions/products/delete');

/* GET product page. */
router.get('/', (req, res) => {
    passport.authenticate('jwt', {session: false}, async (err, user) => {
        if (user) {
            try {
                let rows = await queryPromise(
                    'SELECT * FROM products WHERE userId=?',
                    jwt.verify(req.cookies.token, process.env.JWT_SECRET).id);
                res.render('products/products', {rows: rows});
            } catch(err) { res.render('error', {message: 'Ooops...', error: err}); }
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
router.post('/add', (req, res) => {
    passport.authenticate('jwt', {session: false}, async (err, user) => {
        if (user) {
            try {
                await actionAddProduct(
                    req.body.productName, req.body.description, req.body.picLink,
                    jwt.verify(req.cookies.token, process.env.JWT_SECRET).id);
                res.redirect('/products')
            } catch(err) { res.send(err);}
        } else if (user == false && err === null) return res.redirect('login');
        else return res.render('error', {message: 'Wow! Something\'s wrong...', error: err});
    })(req, res);
});

/* GET edit product page. */
router.get('/edit', (req, res) => {
    passport.authenticate('jwt', {session: false}, async (err, user) => {
        if (user) {
            try {
                let rows = await queryPromise(
                    'SELECT * FROM products WHERE userId=?',
                    jwt.verify(req.cookies.token, process.env.JWT_SECRET).id);
                res.render('products/edit', {rows: rows});
            } catch (err) { res.render('error', {message: 'Ooops...', error: err}); }
        } else if (user == false && err === null) return res.redirect('login');
        else return res.render('error', {message: 'Wow! Something\'s wrong...', error: err});
    })(req, res);
});

//TODO:
/* POST edit product page. */
//'/edit/:id(pattern)/:name'
router.get('/edit/:id', (req, res) => {
    passport.authenticate('jwt', {session: false}, async (err, user) => {
        if (user) {
            try {
                let rows = await queryPromise(
                    'SELECT * FROM products WHERE userId=?',
                    jwt.verify(req.cookies.token, process.env.JWT_SECRET).id);
                res.render('products/products', {rows: rows});
            } catch(err) { res.render('error', {message: 'Ooops...', error: err}); }
            res.render('products/edit', {rows: rows});
        } else if (user == false && err === null) return res.redirect('login');
        else return res.render('error', {message: 'Wow! Something\'s wrong...', error: err});
    })(req, res);
});

/* POST delete product page. */
router.get('/delete/:id', (req, res) => {
    passport.authenticate('jwt', {session: false}, async (err, user) => {
        if (user) {
            try {
                console.log(req.params.id);
                await actionDeleteProduct(
                    req.params.id);
                res.redirect('/products');
            } catch(err) { res.send(err);}
        } else if (user == false && err === null) return res.redirect('login');
        else return res.render('error', {message: 'Wow! Something\'s wrong...', error: err});
    })(req, res);
});

module.exports = router;
