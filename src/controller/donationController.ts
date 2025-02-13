import { Request, Response } from "express";
import { prisma } from "..";

export const receivedDonation = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const amount = req.query.amount;
  const days = req.query.days || 7;

  const lte = new Date();
  const gte = new Date();
  gte.setDate(lte.getDate() - Number(days));

  try {
    const donations = await prisma.donation.findMany({
      where: {
        recipentId: userId,
        amount: amount ? Number(amount) : undefined,
        createdAt: {
          gte,
          lte,
        },
      },
    });

    const totalEarnings = await prisma.donation.aggregate({
      where: {
        recipentId: userId,
        amount: amount ? Number(amount) : undefined,
        createdAt: {
          gte,
          lte,
        },
      },
      _sum: {
        amount: true,
      },
    });

    res.json({ donations, totalEarnings: totalEarnings._sum.amount || 0 });
  } catch (error) {
    console.error("receivedDonation error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
