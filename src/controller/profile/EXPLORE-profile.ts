import { Request, Response } from "express";
import { prisma } from "../..";
import { CustomRequest } from "../../router/usersRouter";

export const profileExplore = async (req: CustomRequest, res: Response) => {
  const { search } = req.query;

  try {
    const exploreData = await prisma.profile.findMany({
      where: {
        name: {
          contains: search as string,
          mode: "insensitive",
        },
      },
    });
    res.json(exploreData);
  } catch (e) {
    console.log(e, "get explore error");
  }
};
