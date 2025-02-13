import { Request, Response, Router } from "express";
import { profileExplore } from "../controller/profile/EXPLORE-profile";
import { prisma } from "..";
import { verifyToken } from "../controller/authorization/verify";
import { CustomRequest } from "./usersRouter";
import { EditProfile, updateCover } from "../controller/profile/EDIT-profile";

export const profileRouter = Router();

profileRouter.get("/explore", profileExplore);
profileRouter.put("/updateCover/:userId", updateCover);

profileRouter.put(`/update`, verifyToken, EditProfile);
profileRouter.post(
  "/",
  verifyToken,
  async (req: CustomRequest, res: Response) => {
    const userId = req.userId;
    const body = req.body;
    try {
      const newProfile = await prisma.profile.create({
        data: {
          ...body,
          userId,
        },
      });
      res.json({
        success: true,
        message: "success",
        code: "SUCCESS",
        data: { newProfile },
      });
    } catch (e) {
      console.error(e, "aldaa");
      res.json({
        success: false,
        message: "success",
        code: "SUCCESS",
        data: null,
      });
    }
  }
);
