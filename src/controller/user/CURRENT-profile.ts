import { Request, Response, Router } from "express";
import { prisma } from "../../..";
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
          res.cookie("accessToken", accessToken, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000,
            sameSite: "strict",
            secure: true,
            domain: ".glpzghoo.space",
          });
          res.cookie("RefreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 4 * 60 * 60 * 1000,
            sameSite: "strict",
            secure: true,
            domain: ".glpzghoo.space",
          });
          res.json({
            message: "Welcome back",
            success: true,
            profileSetup: true,
            data: { id: existingUser.id },
          });
          return;
        }
        const accessToken = jwt.sign(existingUser, process.env.ACCESS_TOKEN, {
          expiresIn: "1h",
        });
        const refreshToken = jwt.sign(existingUser, process.env.REFRESH_TOKEN, {
          expiresIn: "4h",
        });
        res.cookie("accessToken", accessToken, {
          maxAge: 1 * 60 * 60 * 1000,
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          domain: ".glpzghoo.space",
        });
        res.cookie("RefreshToken", refreshToken, {
          httpOnly: true,
          maxAge: 4 * 60 * 60 * 1000,
          sameSite: "strict",
          secure: true,
          domain: ".glpzghoo.space",
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
  const { days, amount } = req.query;

  const date = new Date(
    new Date().setDate(new Date().getDate() - Number(days)) || 0
  );
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        recievedDonations: true,
        sendDonation: true,
        profile: true,
        bankCard: true,
      },
    });
    const totalEarnings = user?.recievedDonations.reduce((acc, donor) => {
      return (acc += donor.amount);
    }, 0);
    const DaysFilter = await prisma.donation.findMany({
      where: {
        recipentId: user?.id,
        amount: { lte: Number(amount) || 10 },
        createdAt: { gte: date },
      },
      include: {
        donor: true,
      },
    });
    const lastDaysEarnings = DaysFilter.reduce((acc, amount) => {
      return (acc += amount.amount);
    }, 0);
    res.json({
      user,
      success: true,
      earningsDataByDay: { DaysFilter },
      totalEarningsByDay: { lastDaysEarnings },
    });
  } catch (e) {
    console.error("aldaa", e);
  }
};
