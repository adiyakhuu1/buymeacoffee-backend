import { Request, Response, Router } from "express";
import { prisma } from "../..";
import { CustomRequest } from "../../router/usersRouter";
export const checkUsername = async (req: CustomRequest, res: Response) => {
  const { username } = req.params;
  if (username.length < 6) {
    res.json({ message: "username is too short", no: "no" });
    return;
  }
  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        username,
      },
    });
    if (existingUser) {
      res.json({ message: "username is taken", no: "no" });
    } else {
      res.json({ message: "username is available", yes: "yes" });
      return;
    }
  } catch (e) {
    console.error(e, "aldaa");
  }
};
