import { Request, Response } from "express";
import { prismaMock } from "../../mock/prisma-mock";
import getAllUsers from "../user/get";
import { User } from "@prisma/client";

describe("Get all user data", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {};
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  it("Should return all user data", async () => {
    // Arrange
    const user = [
      {
        id: 1,
        name: "John Doe",
        email: "johhndoea@gmail.com",
        createdAt: new Date(),
      },
      {
        id: 2,
        name: "Test User",
        email: "test@gmail.com",
        createdAt: new Date(),
      },
    ];

    prismaMock.user.findMany.mockResolvedValue(user as User[]);

    // Act
    await getAllUsers(req as Request, res as Response);

    expect(prismaMock.user.findMany).toHaveBeenCalledWith({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      data: user,
      message: "success",
    });
  });

  it("Should return empty array data", async () => {
    // Arrange
    prismaMock.user.findMany.mockResolvedValue([]);

    // Act
    await getAllUsers(req as Request, res as Response);

    // Assert
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      data: [],
      message: "success",
    });
  });

  it("Should return 500 if error occurs", async () => {
    prismaMock.user.findMany.mockRejectedValue(new Error("Database error"));

    await getAllUsers(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Internal Server Error",
    });
  });
});
