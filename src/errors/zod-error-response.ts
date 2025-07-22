import { ZodError } from "zod";

export class ValidationError extends Error {
  status: number;
  details: any;

  constructor(details: any) {
    super("Validation failed");
    this.status = 400;
    this.details = details;
  }
}

export function handleZodError(error: unknown) {
  if (error instanceof ZodError) {
    throw new ValidationError(
      error.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }))
    );
  }

  throw error;
}
