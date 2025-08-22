import multer from "multer";

const storage = multer.memoryStorage();

export const uploadMiddleware = multer({
  storage,
}).fields([
  {
    name: "imageUrl",
    maxCount: 1,
  },
  {
    name: "videos",
    maxCount: 10,
  },
]);
