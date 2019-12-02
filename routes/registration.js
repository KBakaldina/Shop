const express = require('express');
const router = express.Router();
const actionRegistration = require('../actions/registration');
const jwt = require('jsonwebtoken');

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

        if(result.id) {
            const payload = {
                id: result.id,
                userName: req.body.userName
            };
            const token = jwt.sign(payload, process.env.JWT_SECRET);
            res.cookie('token', token);
            res.redirect('/profile');
        } else res.send(result.msg);
    } catch(err) { res.send(err); }
});

module.exports = router;