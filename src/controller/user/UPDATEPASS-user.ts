import { Request, Response } from "express";
import { prisma } from "../..";
import bcrypt from "bcrypt";
import { CustomRequest } from "../../router/usersRouter";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});
// forgot password method - OTP
export const SendMail1 = async (req: CustomRequest, res: Response) => {
  const { email } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (user) {
      const otp = Math.floor(Math.random() * 899999999 + 100000000);

      await transporter.sendMail({
        from: "Team HackHawks", // sender address
        to: email, // list of receivers
        subject: "OTP code for reset password", // Subject line
        text: "Buy me a coffee / Team HackHawks", // plain text body
        html: `<b>Hello! ${user.username}.</b><p> Here is the OneTimePassword: ${otp}</p>`, // html body
      });
      const newOtp = await prisma.otp.create({
        data: {
          email,
          opt: otp,
        },
      });
      res.json({ success: true, id: newOtp.id });
      return;
    }
    res.json({ success: false });
    return;
  } catch (e) {
    console.error(e, "aldaa");
  }
};
export const OTPcheck1 = async (req: CustomRequest, res: Response) => {
  const { otp, email, id, password } = req.body;
  // res.json({ email });
  try {
    const user = await prisma.otp.findUnique({
      where: {
        id,
      },
    });
    if (user) {
      if (user.opt === Number(otp) && user.email === email) {
        const hashedPass = await bcrypt.hash(
          password,
          Number(process.env.SALT)
        );
        await prisma.user.update({
          where: {
            email,
          },
          data: {
            password: hashedPass,
          },
        });
        res.json({
          message: "OTP_MATCHED",
          success: true,
          code: "PASS_CHANGED_SUCCESSFULLY",
        });
        await prisma.otp.delete({
          where: {
            id,
          },
        });
        return;
      }
      res.json({ success: false, message: "OTP_NOT_MATCHED" });
      return;
    }
    res.json({ success: false, message: "USER_NOT_FOUND" });
    return;
  } catch (e) {
    console.error(e, "aldaa");
  }
};

// used jwt to update password
export const updatepassword = async (req: CustomRequest, res: Response) => {
  const { otp, id, password } = req.body;
  console.log(req.body);
  const userid = req.userId;
  const email = req.email;
  try {
    const user = await prisma.otp.findUnique({
      where: {
        id,
      },
    });
    console.log(user);
    if (user) {
      if (user.opt === Number(otp) && user.email === email) {
        const hashedPass = await bcrypt.hash(
          password,
          Number(process.env.SALT)
        );
        await prisma.user.update({
          where: {
            id: userid,
          },
          data: {
            password: hashedPass,
          },
        });
        res.json({
          message: "OTP MATCHED",
          success: true,
          code: "PASS_CHANGED_SUCCESSFULLY",
        });
        await prisma.otp.delete({
          where: {
            id,
          },
        });
        return;
      }
      res.json({ success: false, message: "OTP didn't match" });
      return;
    }
    res.json({ success: false, message: "OTP expired" });
    return;
  } catch (e) {
    console.error(e, "aldaa");
  }
};
export const SendMail2 = async (req: CustomRequest, res: Response) => {
  // const { email } = req.body;
  // res.json({ email });
  const id = req.userId;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (user) {
      const otp = Math.floor(Math.random() * 899999999 + 100000000);

      await transporter.sendMail({
        from: "Team HackHawks", // sender address
        to: user.email, // list of receivers
        subject: "OTP code for reset password", // Subject line
        text: "Buy me a coffee / Team HackHawks", // plain text body
        html: `<b>Hello! ${user.username}.</b><p> Here is the OneTimePassword: ${otp}</p>`, // html body
      });
      const newOtp = await prisma.otp.create({
        data: {
          email: user.email,
          opt: otp,
        },
      });
      res.json({ success: true, id: newOtp.id });
      return;
    }
    res.json({ success: false });
    return;
  } catch (e) {
    console.error(e, "aldaa");
  }
};
