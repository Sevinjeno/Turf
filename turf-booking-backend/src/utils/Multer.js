import multer from 'multer';

// Store files in memory (no local uploads folder needed)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  if (allowedTypes.test(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only .jpeg, .jpg, .png, .webp files are allowed!"));
  }
};

export const upload = multer({ storage, fileFilter });