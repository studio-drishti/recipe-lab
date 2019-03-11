const path = require('path');
const fs = require('fs');
const router = require('express').Router();
const multer = require('multer');

const { prisma } = require('../../generated/prisma-client');
const getUserId = require('../../utils/getUserId');
const tmpStorage = require('../../utils/tmpStorage');
const upload = multer({
  storage: tmpStorage,
  fileFilter: (req, file, cb) => {
    const mimes = ['image/jpeg', 'image/jpg'];
    if (mimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
});

const rmTmp = file => {
  if (file.path && fs.existsSync(file.path)) fs.unlinkSync(file.path);
};

// Matches /api/avatars/upload
router.post('/upload', upload.single('avatar'), async (req, res) => {
  const userId = getUserId({ request: req });

  if (!userId || !prisma.$exists.user({ id: userId })) {
    rmTmp(req.file);
    return res
      .status(403)
      .json({ error: 'Must be signed in to upload a photo' });
  }

  try {
    const dest = path.resolve(__dirname, '../../public/avatars');
    fs.mkdirSync(dest, { recursive: true });

    const user = await prisma.user({ id: userId });
    const oldAvatar = path.join(dest, user.avatar);
    if (user.avatar && fs.existsSync(oldAvatar)) fs.unlinkSync(oldAvatar);

    fs.renameSync(req.file.path, path.join(dest, req.file.filename));

    prisma.updateUser({
      where: { id: userId },
      data: {
        avatar: req.file.filename
      }
    });

    res.json({
      avatar: `/public/avatars/${user.avatar}`
    });
  } catch (error) {
    rmTmp(req.file);
    res.json(error);
  }
});

module.exports = router;
