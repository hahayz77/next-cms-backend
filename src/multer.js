const multer  = require('multer');
const storage = multer.memoryStorage();

const upload = multer({ 
    dest: 'uploads/', 
    storage: storage, //If the storage option is here no data is written to disk but data is kept in a buffer accessible in the file object.
    limits: {fileSize: 2 * 1024 * 1024}, // Ex => 1 * 1024 * 1024 = 1MB
    fileFilter: (req, file, cb) => {    // Image type permission
        const allowedMimes = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'];
        if(allowedMimes.includes(file.mimetype)){
            cb(null, true);
        } else{
            cb(new Error("Invalid image  type!"));
        }
    }
});

module.exports = upload;