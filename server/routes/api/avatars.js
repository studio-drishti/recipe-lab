const path = require('path');
const fs = require('fs');
const router = require('express').Router();
const multer = require('multer');
const lusca = require('lusca');

const db = require('../../models');
const tmpStorage = require('../../utils/tmpStorage');
const upload = multer({
  storage: tmpStorage
  // fileFilter: (req, file, cb) => {
  //   const mimes = ['image/jpeg', 'image/jpg'];
  //   if (mimes.includes(file.mimetype)) {
  //     cb(null, true);
  //   } else {
  //     cb(null, false);
  //   }
  // }
});

const rmTmp = file => {
  if (file.path && fs.existsSync(file.path)) fs.unlinkSync(file.path);
};

// Matches /api/avatars/upload
router.post('/upload', upload.single('avatar'), lusca.csrf(), (req, res) => {
  if (!req.user) {
    rmTmp(req.file);
    return res
      .status(403)
      .json({ error: 'Must be signed in to upload a photo' });
  }

  db.User.findById(req.user.id)
    .then(user => {
      const oldAvatar = path.resolve(
        __dirname,
        `../../public/avatars/${user.avatar}`
      );
      if (user.avatar && fs.existsSync(oldAvatar)) fs.unlinkSync(oldAvatar);

      fs.renameSync(
        req.file.path,
        path.resolve(__dirname, `../../public/avatars/${req.file.filename}`)
      );

      user.avatar = req.file.filename;
      user.save();
    })
    .catch(err => {
      rmTmp(req.file);
      res.json(err);
    });
});

module.exports = router;
