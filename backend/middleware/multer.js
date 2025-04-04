import multer from 'multer';

const upload = multer({
    storage: multer.diskStorage({
        destination: 'uploads/',
        filename: (req, file, cb) => cb(null, file.originalname)
    }),
    fileFilter: (req, file, cb) => {
        file.mimetype.startsWith('image/')
            ? cb(null, true)
            : cb(new Error('Only image files are allowed'), false);
    },
    limits: { fileSize: 5 * 1024 * 1024 }
});

export default upload;
