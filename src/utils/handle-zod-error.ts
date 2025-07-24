import { Response } from "express";
import { ZodError } from "zod";
import { ValidationError } from "../errors/zod-error-response";

export default function handleZodError(res: Response, error: unknown) {
  if (error instanceof ZodError) {
    const validationError = new ValidationError(error);
    return res.status(validationError.status).json({
      message: validationError.message,
      errors: validationError.errors,
    });
  }
}
