import multer from "multer";

const multerMiddleware = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 2 * 1024 * 1024,
    },
});

export default multerMiddleware;