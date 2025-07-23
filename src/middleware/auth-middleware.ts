import { Request, Response, NextFunction } from "express";
import { verifyToken, JwtPayload } from "../utils/jwt";
import ResponseError from "../errors/response-error";
import { AUTH_IGNORE_PATHS } from "../constant/IGNORED_PATH";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  if (AUTH_IGNORE_PATHS.includes(req.path)) {
    return next();
  }

  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;

    if (!token) {
      throw new ResponseError(401, "Access token is required");
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof ResponseError) {
      return res.status(error.status).json({ error: error.message });
    }
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
