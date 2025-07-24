import { Request, Response } from "express";
import prisma from "../../libs/prisma";
import ResponseError from "../../errors/response-error";
import { comparePassword } from "../../utils/hash";
import { generateToken } from "../../utils/jwt";
import { LoginSchema } from "../../validation/auth/auth.schema";
import handleZodError from "../../utils/handle-zod-error";

const loginUser = async (req: Request, res: Response) => {
  try {
    const result = LoginSchema.parse(req.body);

    const { email, password } = result;

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
    handleZodError(res, error);

    if (error instanceof ResponseError) {
      return res.status(error.status).json({ error: error.message });
    }

    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default loginUser;
