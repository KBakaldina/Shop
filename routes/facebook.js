const express = require('express');
const router = express.Router();
const passport = require('passport');
const request = require('request');

const queryPromise = require('../libs/dbConnection').queryPromise;

router.get('/', (req, res) => {
    passport.authenticate('jwt', {session: false}, async (err, user) => {
   if (user) {
        let rows;
        try {
            rows = await queryPromise('SELECT * FROM facebook WHERE userId=?', [user.id])
        } catch(err) { res.render('error', {error: err}); }

        if (!rows[0]) return res.redirect('/login/facebook');

        request.get(`https://graph.facebook.com/${rows[0].fbId}/?access_token=${rows[0].token}`,
            (err, resp, body) => {
            console.log(body);
            if (err) res.redirect('/login/facebook');
            else res.send(body);
        })
    } else if (user == false && err === null) return res.redirect('login');
    else return res.render('error', {error: err});
})(req, res);
});

module.exports = router;