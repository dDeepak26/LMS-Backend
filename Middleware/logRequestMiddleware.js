export const logRequestMiddleware = (req, res, next) => {
  console.log("========== REQUEST DEBUG ==========");
  console.log("👉 Body:", req.body);
  if (req.file) {
    console.log("👉 Single File:", req.file);
  }
  if (req.files) {
    console.log("👉 Multiple Files:", req.files);
  }
  console.log("===================================");
  next();
};
