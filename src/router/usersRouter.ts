import { Request, Response, Router } from "express";
import { loginUser } from "../controller/user/CURRENT-profile";
import { createUser } from "../controller/user/CREATE-account";
import nodemailer from "nodemailer";
import { prisma } from "..";
import bcrypt from "bcrypt";
import { verifyToken } from "../controller/authorization/verify";
import { checkUsername } from "../controller/user/CHECK-username";
import {
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

usersRouter.post("/addnew", createUser);
// login
usersRouter.post("/auth/sign-in", loginUser);
usersRouter.post(
  "/auth/dashboard/:userId",
  async (req: CustomRequest, res: Response) => {
    const { userId } = req.params;
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          recievedDonations: true,
        },
      });
    } catch (e) {
      console.log(e);
    }
  }
);

usersRouter.post("/auth/:username", checkUsername);

// password uptade hiih endpoint - method 1 forgot password (hereglegch nevterj chadahgui bh ued)
usersRouter.post("/auth/reset/password", SendMail1);
usersRouter.post("/auth/reset/change-password");

// password update endpoint - method 2 update password in settings (hereglegch nevtereed passaa solihiig husvel)
usersRouter.put("/auth/reset/change-password", verifyToken, updatepassword);
usersRouter.put("/auth/reset/password", verifyToken, SendMail2);

// Testing purposes
usersRouter.get("/auth", verifyToken);

usersRouter.get("/auth/testing", async (req: CustomRequest, res: Response) => {
  const thirtyDaysAgo = new Date(new Date().setDate(new Date().getDate() - 30));
  const lasmonth = await prisma.donation.findMany({
    where: {
      createdAt: { gte: thirtyDaysAgo },
    },
    include: {
      recipent: true,
      donor: true,
    },
  });
  res.json({ lasmonth });
});

// login

usersRouter.get(
  "/auth/explore/:userId",
  async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
      const profile = await prisma.profile.findUnique({
        where: {
          userId,
        },
      });
      if (profile) {
        res.json({ profile });
      } else {
        res.json({ message: "user not found" });
      }
    } catch (e) {
      console.error(e, "aldaa");
    }
  }
);
usersRouter.get("/auth", fetchAllUsersProfile);

// Testing purposes
usersRouter.get("/auth/test/login", verifyToken);
