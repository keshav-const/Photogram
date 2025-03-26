// // const multer=require('multer');
// // const storage=multer.memoryStorage();

// // const upload=multer({storage});
// // module.exports=upload;
// const multer = require('multer');

// const storage = multer.memoryStorage(); // Memory storage for buffer
// const upload = multer({ storage });

// module.exports = upload;

const fs = require('fs');
const path = require('path');
const multer = require('multer');

const uploadDir = path.join(__dirname, 'public/uploads');

// Check if "uploads" folder exists, if not, create it
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Set Storage Engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, 'image_' + Date.now() + ext);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
});


module.exports = upload;
