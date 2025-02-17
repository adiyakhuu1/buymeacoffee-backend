import { Request, Response, Router } from "express";
import { receivedDonation } from "../controller/donation/GET-donation";
import { CustomRequest } from "./usersRouter";
import { prisma } from "../..";
import { verifyToken } from "../controller/authorization/verify";

export const donationRouter = Router();

donationRouter.post(
  "/create-donation",
  verifyToken,
  async (req: CustomRequest, res: Response) => {
    const body = req.body;
    const id = req.userId;
    try {
      const newDonation = await prisma.donation.create({
        data: { ...body, donorId: id },
      });
      res.json({ success: true, data: { newDonation } });
    } catch (e) {
      console.error(e, "aldaa");
    }
  }
);

// backend dashboard fetch endpoint (ene hesegt buh donation bolon amount days-eer filterdehed heregleh bolomjtoi)//
donationRouter.get("/:id", receivedDonation);
