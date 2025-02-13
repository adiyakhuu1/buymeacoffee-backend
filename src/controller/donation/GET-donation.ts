import express, { Request, Response } from "express";
import { prisma } from "../..";
import { CustomRequest } from "../../router/usersRouter";

export const receivedDonation = async (req: CustomRequest, res: Response) => {
  const { userId } = req.params;
  const amount = req.query.amount;
  const days = req.query.days ? req.query.days : 7;
  const lte = new Date();
  const gte = new Date(lte);

  const todayDay = lte.getMonth();
  gte.setDate(todayDay - Number(days));

  try {
    const donation = await prisma.donation.findMany({
      where: {
        AND: [{ recipentId: userId }, amount ? { amount: Number(amount) } : {}],
        createdAt: { gte, lte },
      },
    });
    // aggregate ashiglah
    const totalEarnings = await prisma.donation.aggregate({
      where: {
        AND: [
          { recipentId: userId },
          { createdAt: { gte, lte } },
          amount ? { amount: Number(amount) } : {},
        ],
      },
      _sum: {
        amount: true,
      },
    });
    res.json({ donation, totalEarnings });
  } catch (e) {
    console.error(e, "received donation error");
  }
};
