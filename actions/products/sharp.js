const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

module.exports = async (filePath) => {
    let newFilePath = path.dirname(filePath)+'/resized-'+path.basename(filePath);
    await sharp(filePath)
        .resize(200, 100, {fit: sharp.fit.inside})
        .jpeg({quality: 100})
        .toFile(newFilePath);
    fs.unlink(filePath, (err)=>{ if (err) throw err; });
    return newFilePath;
};