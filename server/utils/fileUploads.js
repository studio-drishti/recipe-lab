const fs = require('fs');
const path = require('path');
const getSlug = require('speakingurl');

const generateFilename = originalFilename => {
  const maxLength = 50;
  const filePath = path.parse(originalFilename);

  let filename = filePath.name.toLowerCase();

  if (filename.length > maxLength)
    filename = filename.substring(0, maxLength).trim();

  filename = getSlug(filename) + '_' + Date.now() + filePath.ext;

  return filename;
};

const storeFS = (stream, dest, originalFilename) => {
  const id = Date.now();
  const filename = generateFilename(originalFilename);
  const filepath = path.join(dest, filename);
  return new Promise((resolve, reject) =>
    stream
      .on('error', error => {
        if (stream.truncated)
          // Delete the truncated file.
          fs.unlinkSync(filepath);
        reject(error);
      })
      .pipe(fs.createWriteStream(filepath))
      .on('error', error => reject(error))
      .on('finish', () => resolve({ id, filename }))
  );
};

module.exports = {
  generateFilename,
  storeFS
};
