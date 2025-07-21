import { Request, Response } from "express";
import prisma from "../../libs/prisma";
import ResponseError from "../../errors/response-error";
import { hashPassword } from "../../utils/hash";

const registerUser = async (req: Request, res: Response) => {
  const { email, name, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ResponseError(409, "User with this email is exists");
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    res.status(201).json({
      message: "User registered successfully!",
      user: { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt },
    });
  } catch (error) {
    if (error instanceof ResponseError) {
      return res.status(error.status).json({ error: error.message });
    }

    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default registerUser;
