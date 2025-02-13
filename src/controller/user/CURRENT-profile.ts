import { Request, Response, Router } from "express";
import { prisma } from "../..";
import bcrypt from "bcrypt";
import { CustomRequest } from "../../router/usersRouter";
const jwt = require("jsonwebtoken");
export const loginUser = async (req: CustomRequest, res: Response) => {
  const { email, password } = req.body;
  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (existingUser) {
      const pass = await bcrypt.compare(password, existingUser.password);
      if (pass) {
        const existingProfile = await prisma.profile.findFirst({
          where: { userId: existingUser.id },
        });
        if (existingProfile) {
          const accessToken = jwt.sign(existingUser, process.env.ACCESS_TOKEN, {
            expiresIn: "1h",
          });
          const refreshToken = jwt.sign(
            existingUser,
            process.env.REFRESH_TOKEN,
            {
              expiresIn: "4h",
            }
          );
          res.cookie("Authorization", accessToken, {
            httpOnly: true,
            maxAge: 300000,
            sameSite: "strict",
            secure: true,
          });
          res.cookie("RefreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 4 * 60 * 60 * 1000,
            sameSite: "strict",
            secure: true,
          });
          res.json({
            message: "Welcome back",
            success: true,
            profileSetup: true,
            data: { id: existingUser.id },
          });
          console.log(accessToken);
          return;
        }
        const accessToken = jwt.sign(existingUser, process.env.ACCESS_TOKEN, {
          expiresIn: "1h",
        });
        const refreshToken = jwt.sign(existingUser, process.env.REFRESH_TOKEN, {
          expiresIn: "4h",
        });
        res.cookie("Authorization", accessToken, {
          maxAge: 1 * 60 * 60 * 1000,
          httpOnly: true,
          secure: true,
          sameSite: "none",
        });
        res.cookie("RefreshToken", refreshToken, {
          httpOnly: true,
          maxAge: 4 * 60 * 60 * 1000,
          sameSite: "strict",
          secure: true,
        });
        res.json({
          message: "Welcome back",

          success: true,
          data: { id: existingUser.id },
        });

        return;
      } else {
        res.json({
          message: "WRONG_PASSWORD",
          success: false,
          data: {},
        });
      }
    } else {
      res.json({ message: "NOT_REGISTERED", success: false, data: {} });
    }
  } catch (e) {
    console.error(e, "aldaa");
  }
};

// dashboard current profile (jwt method - do not touch)
export const LoggedUserInfo = async (req: CustomRequest, res: Response) => {
  const userId = req.userId;

  const day30 = new Date(new Date().setDate(new Date().getDate() - 30));
  const day60 = new Date(new Date().setDate(new Date().getDate() - 60));
  const day90 = new Date(new Date().setDate(new Date().getDate() - 60));
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        recievedDonations: true,
        sendDonation: true,
        profile: true,
      },
    });
    const totalEarnings = user?.recievedDonations.reduce((acc, donor) => {
      return (acc += donor.amount);
    }, 0);
    const day30data = await prisma.donation.findMany({
      where: {
        recipentId: user?.id,
        createdAt: { gte: day30 },
      },
      include: {
        donor: true,
      },
    });
    const day60data = await prisma.donation.findMany({
      where: {
        recipentId: user?.id,
        createdAt: { gte: day60 },
      },
      include: {
        donor: true,
      },
    });
    const day90data = await prisma.donation.findMany({
      where: {
        recipentId: user?.id,
        createdAt: { gte: day90 },
      },
      include: {
        donor: true,
      },
    });
    const day30earnings = day30data.reduce((acc, amount) => {
      return (acc += amount.amount);
    }, 0);
    const day60earnings = day60data.reduce((acc, amount) => {
      return (acc += amount.amount);
    }, 0);
    const day90earnings = day60data.reduce((acc, amount) => {
      return (acc += amount.amount);
    }, 0);
    res.json({
      user,
      success: true,
      earningsData: { day30data, day60data, day90data },
      earnings: { day30earnings, day60earnings, day90earnings },
    });
  } catch (e) {
    console.error("aldaa", e);
  }
};
