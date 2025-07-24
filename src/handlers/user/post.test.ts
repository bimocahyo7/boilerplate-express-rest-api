import { Response, Request } from "express";
import { prismaMock } from "../../mock/prisma-mock";
import createNewUser from "./post";
import { User } from "@prisma/client";

describe("Post new user", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      body: {
        email: "test@gmail.com",
        name: "John Doe",
        password: "password12345",
      },
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  it("Should return new user", async () => {
    // Arrange
    const user = {
      id: 1,
      email: "testuser@gmail.com",
      name: "John Doe",
      password: "password12345",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    prismaMock.user.findUnique.mockResolvedValue(null);
    prismaMock.user.create.mockResolvedValue(user as User);

    // Act
    await createNewUser(req as Request, res as Response);

    // Assert
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { email: "test@gmail.com" },
    });

    expect(prismaMock.user.create).toHaveBeenCalledWith({
      data: {
        email: "test@gmail.com",
        name: "John Doe",
        password: "password12345",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ data: user, message: "Success create new user" });
  });

  it("Should be error 409", async () => {
    // Arrange
    const existingUser = {
      id: 1,
      email: "test@gmail.com",
      name: "Test User",
      password: "test12345",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    prismaMock.user.findUnique.mockResolvedValue(existingUser as User);

    // Act
    await createNewUser(req as Request, res as Response);

    // Assert
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { email: "test@gmail.com" },
    });

    expect(prismaMock.user.create).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      error: "User with this email is exists",
    });
  });

  it("Should return 500 if error occurs", async () => {
    // Arrange
    prismaMock.user.create.mockRejectedValue(new Error("Database error"));

    // Act
    await createNewUser(req as Request, res as Response);

    // Assert
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Internal Server Error",
    });
  });
});
