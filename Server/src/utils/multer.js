import multer from "multer";
import fs from "fs";
import { nanoid } from "nanoid";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const fileValidation = {
  image: [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/jpg",
    "image/svg+xml",
    "image/bmp",
    "image/webp",
    "image/tiff",
    "image/apng",
    "image/x-icon",
    "image/vnd.microsoft.icon",
    "image/heif",
    "image/heic",
    "image/jp2",
    "image/jxr",
    "image/pjpeg",
    "image/x-jng",
  ],
  file: ["application/pdf", "application/msword"],
  video: ["video/mp4"],
  messages: [
    "application/x-msdownload",
    "application/x-dll",
    "text/javascript",
    "text/html",
    "text/htm",
  ],
};
export function fileUpload(customPath = "general", customValidation = []) {
  const fullPath = path.join(__dirname, `../uploads/${customPath}`);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, fullPath);
    },
    filename: (req, file, cb) => {
      const uniqueFileName = nanoid() + "_" + file.originalname;
      file.dest = `uploads/${customPath}/${uniqueFileName}`;
      cb(null, uniqueFileName);
    },
  });
  function fileFilter(req, file, cb) {
    if (customValidation.length === 5) {
      if (!customValidation.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb("In-valid file format", false);
      }
    } else {
      if (customValidation.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb("In-valid file format", false);
      }
    }
  }

  const upload = multer({ fileFilter, storage });
  return upload;
}

// import multer from "multer";
// export const fileValidation = {
//   image: ["image/jpeg", "image/jpg", "image/png", "image/gif"],
//   file: ["application/pdf", "application/msword"],
//   video: ["video/mp4"],
// };
// export function fileUpload(customValidation = []) {
//   const storage = multer.diskStorage({});
//   function fileFilter(req, file, cb) {
//     if (customValidation.includes(file.mimetype)) {
//       cb(null, true);
//     } else {
//       cb("In-valid file format", false);
//     }
//   }
//   const upload = multer({
//     fileFilter,
//     storage,
//     limits: { fileSize: 1024 * 1024 * 50 },
//   });
//   return upload;
// }
