import { Request, Response } from "express";
import { prisma } from "../../..";
import { CustomRequest } from "../../router/usersRouter";

export const EditProfile = async (req: CustomRequest, res: Response) => {
  const body = req.body;
  const userId = req.userId;
  try {
    const editProfile = await prisma.profile.update({
      where: {
        userId,
      },
      data: body,
    });
    res.json({ success: true, message: "success" });
  } catch (e) {
    console.error(e, "aldaa");
    res.json({ success: false });
  }
};

export const updateCover = async (req: CustomRequest, res: Response) => {
  const { image } = req.body;
  const id = req.userId;
  try {
    const user = await prisma.profile.findUnique({
      where: {
        userId: id,
      },
    });
    if (user) {
      const change = await prisma.profile.update({
        where: {
          userId: id,
        },
        data: {
          backgroundImage: image,
        },
      });
      res.json({ message: "success" });
    }
  } catch (e) {
    console.error(e, "aldaa");
  }
};
