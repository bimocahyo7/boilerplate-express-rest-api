import { Request, Response } from "express";
import prisma from "../../libs/prisma";
import ResponseError from "../../errors/response-error";
import { comparePassword } from "../../utils/hash";
import { generateToken } from "../../utils/jwt";

const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      throw new ResponseError(400, "Email and password are required.");
    }

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
    if (error instanceof ResponseError) {
      return res.status(error.status).json({ error: error.message });
    }

    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default loginUser;
