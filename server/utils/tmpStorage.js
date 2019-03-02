const multer = require('multer');
const path = require('path');
const slugify = require('slugify');

module.exports = multer.diskStorage({
  destination: path.resolve(__dirname, '../tmp'),
  filename: (req, file, cb) => {
    const maxLength = 50;
    const filePath = path.parse(file.originalname);

    let filename = filePath.name.toLowerCase();

    if (filename.length > maxLength)
      filename = filename.substring(0, maxLength).trim();

    filename =
      slugify(filename, { remove: /[*+~.()'"!:@]/g }) +
      '_' +
      Date.now() +
      filePath.ext;

    cb(null, filename);
  }
});
