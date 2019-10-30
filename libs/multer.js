const multer = require('multer');
const path = require('path');

let storage = multer.diskStorage({
    destination: (req, file, done) => {
        done(null, 'libs/uploads');
    },
    filename: (req, file, done) => {
            done(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer( {storage: storage});

module.exports = upload;