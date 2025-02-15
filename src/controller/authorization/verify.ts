import { NextFunction, Request, Response } from "express";
import { CustomRequest } from "../../router/usersRouter";
const jwt = require("jsonwebtoken");
require("dotenv").config();

// ajillaj bga
export const verifyToken = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies.Authorization;
  const { id } = req.params;
  try {
    if (accessToken) {
      const verifyToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN);
      if (verifyToken) {
        req.userId = verifyToken.id;
        req.email = verifyToken.email;
        req.owner = verifyToken.id === id;

        // console.log(verifyToken);
        next();
        return;
      }
      res.json({
        success: false,
        message: "invalid token",
        code: "INVALID_TOKEN",
      });
      return;
    }
    res.json({ success: false, message: "JWT expired", code: "JWT_EXPIRED" });
    return;
  } catch (e) {
    console.error(e);

    res.json({
      success: false,
      message: "no token provided",
      code: "NO_TOKEN_PROVIDED",
    });
  }
};
export const verifyOwner = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies.Authorization;
  const { id } = req.params;

  try {
    if (accessToken) {
      const verifyToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN);
      if (verifyToken) {
        req.userId = verifyToken.id;
        req.email = verifyToken.email;
        req.owner = verifyToken.id === id;
        next();
        return;
      }
      req.owner = verifyToken.id === id;
      next();
      return;
    }
    req.owner = false;
    next();

    return;
  } catch (e) {
    console.error(e);
    req.owner = false;

    next();
  }
};
