import { Request, Response } from "express";
import { prisma } from "../..";
import bcrypt from "bcrypt";
import { configDotenv } from "dotenv";
import { CustomRequest } from "../../router/usersRouter";
configDotenv();
export const createUser = async (req: CustomRequest, res: Response) => {
  const { email, password, username } = req.body;
  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (existingUser) {
      res.json({
        message: "hereglegch burtgeltei bna",
        success: false,
        data: {},
      });
      return;
    }
    const rounds = process.env.SALT;
    console.log(rounds);
    const encryptedPass = await bcrypt.hash(password, Number(rounds));
    const newUser = await prisma.user.create({
      data: { email, password: encryptedPass, username },
    });
    res.json({
      message: "Amjilttai burtgegdlee",
      success: true,
      data: {},
    });
  } catch (e) {
    console.error(e, "aldaa");
  }
};
