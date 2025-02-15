import { Request, Response, Router } from "express";
import { loginUser } from "../controller/user/CURRENT-profile";
import { createUser } from "../controller/user/CREATE-account";
import nodemailer from "nodemailer";
import { prisma } from "..";
import bcrypt from "bcrypt";
import { verifyOwner, verifyToken } from "../controller/authorization/verify";
import { checkUsername } from "../controller/user/CHECK-username";
import {
  OTPcheck1,
  SendMail1,
  SendMail2,
  updatepassword,
} from "../controller/user/UPDATEPASS-user";
import { fetchAllUsersProfile } from "../controller/user/VIEW-profile";
const jwt = require("jsonwebtoken");
require("dotenv").config();
export type CustomRequest = Request & {
  userId?: string;
  email?: string;
  owner?: boolean;
};
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});
export const usersRouter = Router();
// register
usersRouter.post("/addnew", createUser);
// login
usersRouter.post("/auth/sign-in", loginUser);

usersRouter.get(
  "/auth/dashboard/:id",
  verifyOwner,
  async (req: CustomRequest, res: Response) => {
    const { id } = req.params;
    const owner = req.owner;
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: id,
        },
        include: {
          recievedDonations: true,
          profile: true,
        },
      });

      res.json({ success: true, data: { user }, owner });
    } catch (e) {
      console.log(e);
    }
  }
);

usersRouter.post("/auth/:username", checkUsername);

// password uptade hiih endpoint - method 1 forgot password (hereglegch nevterj chadahgui bh ued)
usersRouter.post("/auth/reset/password", SendMail1);
usersRouter.post("/auth/reset/change-password", OTPcheck1);

// password update endpoint - method 2 update password in settings (hereglegch nevtereed passaa solihiig husvel)
usersRouter.put("/auth/reset/change-password", verifyToken, updatepassword);
usersRouter.put("/auth/reset/password", verifyToken, SendMail2);
