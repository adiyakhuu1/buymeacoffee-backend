import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  userId?: string; // userId-г нэмэх
}

export const verifyToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access Denied" });
  }

  try {
    const secretKey = process.env.JWT_SECRET || "your_secret_key";
    const verified = jwt.verify(token, secretKey) as { id: string };
    req.userId = verified.id;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid Token" });
  }
};
