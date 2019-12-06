const express = require('express');
const router = express.Router();
const actionRegistration = require('../actions/registration');
const actionCreateJWT = require('../actions/createJWT');

const upload = require('../libs/multer');
const actionSharpPic = require('../actions/products/sharp');


/* GET registration page.*/
router.get('/', (req, res) => {
    res.render('registration');
});

/* POST registration page.*/
router.post('/', upload.single('pictureFile'), async(req, res) => {
    try {
        let pictureLink = await actionSharpPic(req.file.path);
        let result = await actionRegistration(req.body.userName, req.body.email, req.body.userPassword,
            req.body.userPassword2, '/'+pictureLink.substring(7));

        const token = actionCreateJWT(result.id, req.body.userName);
        res.cookie('token', token);
        res.redirect('/profile');
    } catch(err) { res.render('error',{error: err}); }
});

module.exports = router;