import { PrismaClient } from "@prisma/client";
import { Request, Response, Router } from "express";
import { createBankCard } from "../controller/bank/CREATE-bankcard";
import { fetchBankCard } from "../controller/bank/GET-bankcard";
import { editBankCard } from "../controller/bank/EDIT-bankcard";
import { verifyToken } from "../controller/authorization/verify";

export const bankCardRouter = Router();

//banknii card uusgeh endpoint
bankCardRouter.post("/", verifyToken, createBankCard);

//banknii cardniihaa medeelliig duudaj awah endpoint
bankCardRouter.get("/", fetchBankCard);

// banknii cardniihaa medeelliig oorchloh endpoint
bankCardRouter.put("/:userId", editBankCard);
