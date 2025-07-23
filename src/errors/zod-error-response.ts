import { ZodError } from "zod";

export class ValidationError extends Error {
  status: number;
  errors: { [key: string]: string };

  constructor(error: ZodError) {
    super("Validation failed");
    this.status = 400;
    this.errors = {};

    error.issues.forEach((e) => {
      const fieldName = e.path.join(".");
      this.errors[fieldName] = e.message;
    });
  }
}
