import { Request, Response, Router } from "express";
import { verifyToken } from "../controller/authorization/verify";
import { LoggedUserInfo } from "../controller/user/CURRENT-profile";

export const LoggedUserRouter = Router();

LoggedUserRouter.get("/", verifyToken, LoggedUserInfo);
