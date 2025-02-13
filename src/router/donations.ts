import { Request, Response, Router } from "express";
import { receivedDonation } from "../controller/donation/GET-donation";
import { CustomRequest } from "./usersRouter";
import { prisma } from "..";

export const donationRouter = Router();

donationRouter.post(
  "/create-donation",
  async (req: CustomRequest, res: Response) => {
    const body = req.body;
    try {
      const newDonation = await prisma.donation.create({
        data: body,
      });
      res.json({ success: true, data: { newDonation } });
    } catch (e) {
      console.error(e, "aldaa");
    }
  }
);

// backend dashboard fetch endpoint (ene hesegt buh donation bolon amount days-eer filterdehed heregleh bolomjtoi)//
donationRouter.get("/:userId", receivedDonation);
