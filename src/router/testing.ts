import { NextFunction, Request, Response, Router } from "express";
import { verifyToken } from "../controller/authorization/verify";
import { LoggedUserInfo } from "../controller/user/CURRENT-profile";
import jwt from "jsonwebtoken";
import { CustomRequest } from "./usersRouter";
export const LoggedUserRouter = Router();

LoggedUserRouter.get(
  "/",
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const RefreshToken = req.cookies.RefreshToken;
    try {
      if (RefreshToken) {
        const verifyToken = jwt.verify(
          RefreshToken,
          process.env.REFRESH_TOKEN!
        ) as { id: string };
        if (RefreshToken) {
          const NewAccessToken = jwt.sign(
            verifyToken,
            process.env.ACCESS_TOKEN!
          );
          const NewRefreshToken = jwt.sign(
            verifyToken,
            process.env.REFRESH_TOKEN!
          );
          req.userId = verifyToken.id;
          res
            .cookie("accessToken", NewAccessToken, {
              sameSite: "strict",
              secure: true,
              maxAge: 60 * 60 * 1000,
              httpOnly: true,
              domain: ".glpzghoo.space",
            })
            .cookie("RefreshToken", NewRefreshToken, {
              sameSite: "strict",
              secure: true,
              maxAge: 24 * 60 * 60 * 1000,
              httpOnly: true,
              domain: ".glpzghoo.space",
            });
          next();
          return;
        }
      }
      res.json({
        success: false,
        message: "No Token Provided",
        code: "NO_TOKEN",
      });
    } catch (err) {
      console.error(err, "aldaa");
      res.json({
        success: false,
        message: "Error",
        code: "ERROR",
      });
    }
  },
  LoggedUserInfo
);
