const multer = require('multer');

// Memory storage keeps file buffers in memory and avoids cPanel OS temp file locks
const memoryUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 30 * 1024 * 1024 }, // 30MB
});

const uploadMiddleware = (req, res, next) => {
  memoryUpload.any()(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || 'File upload failed',
      });
    }

    if (req.files && req.files.length > 0) {
      req.file = req.files[0];
    }
    next();
  });
};

module.exports = uploadMiddleware;
