const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const queryPromise = require('../libs/dbConnection').queryPromise;
const actionAddProduct = require('../actions/products/add');
const actionUpdateProduct = require('../actions/products/update');
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
router.post('/add',  async (req, res) => {
    try {
        await actionAddProduct(
            req.body.productName, req.body.description, req.body.picLink,
            jwt.verify(req.cookies.token, process.env.JWT_SECRET).id);
        res.redirect('/products')
    } catch(err) { res.send(err);}
});

/* GET update product page. */
router.get('/update', (req, res) => {
    passport.authenticate('jwt', {session: false}, async (err, user) => {
        if (user) {
            //TODO: передать rows из products.ejs(прочитать из req?)
            try {
                let rows = await queryPromise(
                    'SELECT * FROM products WHERE userId=?',
                    jwt.verify(req.cookies.token, process.env.JWT_SECRET).id);
                res.render('products/update', {rows: rows});
            } catch (err) {
                res.render('error', {message: 'Ooops...', error: err});
            }
        } else if (user == false && err === null) return res.redirect('login');
        else return res.render('error', {message: 'Wow! Something\'s wrong...', error: err});
    })(req, res);
});

//TODO:
/* POST update product page. */
router.post('/update/:id()/:name', (req, res) => {
    //req.params.id
    res.send("product was updated");
});

/* GET delete product page. */
router.get('/delete', (req, res) => {
    passport.authenticate('jwt', {session: false}, async (err, user) => {
        if (user) {
            //TODO: передать rows из products.ejs(прочитать из req?)
            try{
                let rows = await queryPromise(
                    'SELECT * FROM products WHERE userId=?',
                    jwt.verify(req.cookies.token, process.env.JWT_SECRET).id);
                res.render('products/delete', {rows: rows});
            } catch(err) {res.send(err);}
        }
        else if (user == false && err === null) return res.redirect('login');
        else return res.render('error', {message: 'Wow! Something\'s wrong...', error: err});
    })(req, res);
});

/* POST delete product page. */
router.post('/delete', async (req, res) => {
    console.log(typeof req.body.productIdToDelete);
    try {
        await actionDeleteProduct(
            req.body.productIdToDelete);
        res.redirect('/products')
    } catch(err) { res.send(err);}
});

module.exports = router;
