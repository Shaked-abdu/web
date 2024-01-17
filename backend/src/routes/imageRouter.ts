import { Request, Response, Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const imageRouter = Router();

const createUploadsDirectory = (uploadPath: string) => {
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "uploads");
    createUploadsDirectory(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${req.params.id}.png`);
  },
});

const upload = multer({ storage });

interface IImageRequest extends Request {
  file: multer.Multer.File;
}

imageRouter.post(
  "/uploads/:id",
  upload.single("image"),
  (req: IImageRequest, res: Response) => {
    if (!req.file) {
      res.status(400).send();
    }
    res.send();
  }
);

imageRouter.get("/:id", (req, res) => {
  const imageId = req.params.id;
  const imagePath = path.join(__dirname, "uploads", `${imageId}.png`);

  if (fs.existsSync(imagePath)) {
    res.sendFile(imagePath);
  } else {
    res.status(404).send();
  }
});
export default imageRouter;
