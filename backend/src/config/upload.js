const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const uploadsDirectory = process.env.DEVELOPMENT_UPLOADS_DIRECTORY

if (process.env.NODE_ENV === 'production') {
    uploadsDirectory = process.env.PRODUCTION_UPLOADS_DIRECTORY;
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDirectory)
    },
    filename: (req, file, cb) => {
        crypto.pseudoRandomBytes(16, (err, raw) =>
            cb(null, raw.toString('hex') + path.extname(file.originalname)))
    }
})

const filter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Unsupported file type'), false);
    }
}

module.exports = multer({
    storage: storage,
    limits: {
        fileSize: 5242880 // 5MB
    },
    fileFilter: filter
}).single('image');