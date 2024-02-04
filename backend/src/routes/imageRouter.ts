import { Request, Response, Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { StatusCodes } from "http-status-codes";

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


/**
 * @swagger
 * /images/uploads/{id}:
 *   post:
 *     tags:
 *       - Images
 *     summary: Upload image by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the image to get
 *     responses:
 *       201:
 *         description: Successful operation
 *       400:
 *        description: Bad request
 */
imageRouter.post(
  "/uploads/:id",
  upload.single("image"),
  (req: IImageRequest, res: Response) => {
    if (!req.file) {
      res.status(400).send();
    }
    res.status(StatusCodes.CREATED).send();
  }
);

/**
 * @swagger
 * /images/{id}:
 *   get:
 *     tags:
 *       - Images
 *     summary: Get a image by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the image to get
 *     responses:
 *       200:
 *         description: Successful operation
 *       404:
 *        description: User not found
 */
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
