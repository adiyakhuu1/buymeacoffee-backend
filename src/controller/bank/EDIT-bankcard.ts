import { Request, Response } from "express";
import { prisma } from "../..";
import { CustomRequest } from "../../router/usersRouter";
export const editBankCard = async (req: CustomRequest, res: Response) => {
  const { userId } = req.params;
  const { country, firstName, lastName, cardNumber, expiryDate } = req.body;

  try {
    const updatedBankCard = await prisma.bankCard.update({
      where: {
        userId: userId,
      },
      data: {
        country,
        firstName,
        lastName,
        cardNumber,
        expiryDate,
      },
    });
    res.json({
      status: 200,
      code: "UPDATE_CARD_SUCCESSFULL",

      message: "card informations updated succefully",
      success: true,
      data: updatedBankCard,
    });
  } catch (e) {
    console.log(e, "error while updating bankcard");
  }
};
