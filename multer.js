const multer = require('multer');
const path   = require('path');
const fs     = require('fs');
require('dotenv').config();

const UPLOAD_DIR   = process.env.UPLOAD_DIR || 'uploads';
const MAX_SIZE     = parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024;

const ensure = (dir) => { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); };

const storage = (subDir) => multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(UPLOAD_DIR, subDir);
    ensure(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext  = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/\s+/g, '_');
    cb(null, `${Date.now()}_${base}${ext}`);
  },
});

const imageFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/;
  allowed.test(path.extname(file.originalname).toLowerCase())
    ? cb(null, true)
    : cb(new Error('Only image files are allowed'));
};

const docFilter = (req, file, cb) => {
  const allowed = /pdf|doc|docx|ppt|pptx|xls|xlsx|txt|zip/;
  allowed.test(path.extname(file.originalname).toLowerCase())
    ? cb(null, true)
    : cb(new Error('Unsupported file type'));
};

const uploaders = {
  profilePicture: multer({ storage: storage('profile'),     fileFilter: imageFilter, limits: { fileSize: 2 * 1024 * 1024 } }),
  material:       multer({ storage: storage('materials'),   fileFilter: docFilter,   limits: { fileSize: MAX_SIZE } }),
  assignment:     multer({ storage: storage('assignments'), fileFilter: docFilter,   limits: { fileSize: MAX_SIZE } }),
  submission:     multer({ storage: storage('submissions'), fileFilter: docFilter,   limits: { fileSize: MAX_SIZE } }),
  chatFile:       multer({ storage: storage('chat'),        limits:     { fileSize: MAX_SIZE } }),
};

module.exports = uploaders;
