import { ZodError } from "zod";

export class ValidationError extends Error {
  status: number;
  errors: any;

  constructor(error: ZodError) {
    super("Validation failed");
    this.status = 400;
    this.errors = error.issues.map((e) => ({
      field: e.path.join("."),
      message: e.message,
      code: e.code,
    }));
  }
}
