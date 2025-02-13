import { Request, Response } from "express";
import { prisma } from "../..";
import { CustomRequest } from "../../router/usersRouter";

export const fetchBankCard = async (req: CustomRequest, res: Response) => {
  try {
    const bankCards = await prisma.bankCard.findMany();
    res.json(bankCards);
  } catch (e) {
    console.error(e, "aldaa");
  }
};
