import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

const authentificate = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    return res.sendStatus(StatusCodes.UNAUTHORIZED);
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(StatusCodes.FORBIDDEN);
    }

    req.user = user;
    next();
  });
};

export = authentificate;
