import { Request, Response } from "express";
import prisma from "../../libs/prisma";
import ResponseError from "../../errors/response-error";
import { hashPassword } from "../../utils/hash";
import { ValidationError } from "../../errors/zod-error-response";
import { RegisterSchema } from "../../validation/auth/auth.schema";

const registerUser = async (req: Request, res: Response) => {
  try {
    const result = RegisterSchema.safeParse(req.body);

    if (!result.success) {
      throw new ValidationError(result.error);
    }

    const { email, name, password } = result.data;

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
    if (error instanceof ValidationError) {
      return res.status(error.status).json({
        message: error.message,
        errors: error.errors,
      });
    }

    if (error instanceof ResponseError) {
      return res.status(error.status).json({ error: error.message });
    }

    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default registerUser;
