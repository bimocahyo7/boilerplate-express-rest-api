import z from "zod";
import { RegisterSchema, LoginSchema } from "./auth.schema";
import { handleZodError } from "../../errors/zod-error-response";

export function validateRegisterInput(data: unknown) {
  try {
    return RegisterSchema.parse(data);
  } catch (error) {
    handleZodError(error);
  }
}

export function validateLoginInput(data: unknown) {
  try {
    return LoginSchema.parse(data);
  } catch (error) {
    handleZodError(error);
  }
}
