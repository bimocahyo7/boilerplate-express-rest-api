import { Request, Response } from "express";
import prisma from "../../libs/prisma";
import ResponseError from "../../errors/response-error";
import { comparePassword } from "../../utils/hash";
import { generateToken } from "../../utils/jwt";
import { ValidationError } from "../../errors/zod-error-response";
import { LoginSchema } from "../../validation/auth/auth.schema";

const loginUser = async (req: Request, res: Response) => {
  try {
    const result = LoginSchema.safeParse(req.body);

    if (!result.success) {
      throw new ValidationError(result.error);
    }

    const { email, password } = result.data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new ResponseError(401, "Invalid email or password.");
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new ResponseError(401, "Invalid email or password.");
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
    });

    res.status(200).json({
      message: "Login successful!",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
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

export default loginUser;
