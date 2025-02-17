import express, { Request, Response } from "express";
import { bankCardRouter } from "./src/router/bankCardRouter";
import { configDotenv } from "dotenv";
import { PrismaClient } from "@prisma/client";
import { CustomRequest, usersRouter } from "./src/router/usersRouter";
import cors from "cors";
require("dotenv").config();
import { donationRouter } from "./src/router/donations";
import { profileRouter } from "./src/router/profile";
import cookieParser from "cookie-parser";
import { LoggedUserRouter } from "./src/router/testing";
import session from "express-session";
import jwt from "jsonwebtoken";
const app = express();
const PORT = process.env.PORT;
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

export const prisma = new PrismaClient();

// bank card backend endpoint ///
app.use("/bank-card", bankCardRouter);

// profiel backend endpoint //
app.use("/profile", profileRouter);

// user/auth backend endpoint //
app.use("/users", usersRouter);

// donation backend endpoint //
app.use("/donation", donationRouter);

// Logged user info - do not touch
app.use("/dashbordInfo", LoggedUserRouter);
// Logout
app.get("/logout", async (req: Request, res: Response) => {
  try {
    res.cookie("Authorization", "", {
      maxAge: 0,
      sameSite: "strict",
      secure: true,
      httpOnly: true,
    });
    res.cookie("RefreshToken", "", {
      maxAge: 0,
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    res.json({ success: true, message: "Successfully logged out!" });
  } catch (err) {
    console.log(err);
  }
});

// refresh token - testing
app.get("/", async (req: CustomRequest, res: Response) => {
  const refreshToken = req.cookies.RefreshToken;
  try {
    if (!refreshToken) {
      res.json({ success: false, code: "NO_TOKEN_PROVIDED" });
      return;
    }
    const refresh = process.env.REFRESH_TOKEN;
    if (refresh) {
      const verify = jwt.verify(refreshToken, refresh) as { id: string };

      if (verify) {
        const user = await prisma.user.findUnique({
          where: {
            id: verify.id,
          },
        });
        if (user) {
          const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN!, {
            expiresIn: "5m",
          });
          res.cookie("Authorization", accessToken, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 300000,
            secure: true,
          });
          res.json({ success: true, code: "TOKEN_REFRESHED_SUCCESSFULLY" });
          return;
        }
        res.json({ success: false, message: "User not found" });
      }
    }
    res.json({ success: false, code: "NO_TOKEN_PROVIDED" });
  } catch (e) {
    console.error(e, "error");
  }
});
// testing purposes

// ene hesgiig bitgii oroldooroi hend ch hereggu heseg shvv//
app.listen(PORT, () => {
  console.log(`it's on http://localhost:${PORT}`);
});
