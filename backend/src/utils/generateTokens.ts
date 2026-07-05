import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import type { ObjectId } from "mongodb";
import { tokenPayloadSchema } from "../schemas/auth";
function generateAccessToken(userId: ObjectId, userEmail: string) {
  return jwt.sign(
    {
      userId: userId,
      email: userEmail,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "2min",
    },
  );
}
function decodeAccessToken(accessToken: string) {
  const validatedToken = tokenPayloadSchema.parse(
    jwt.verify(accessToken, process.env.JWT_SECRET as string),
  );

  return validatedToken;
}
function generateRefreshToken(userId: ObjectId, userEmail: string) {
  return jwt.sign({ userId, email: userEmail }, process.env.JWT_SECRET || "", {
    expiresIn: "30d",
  });
}
function decodeRefreshToken(refreshToken: string) {
  const validatedToken = tokenPayloadSchema.parse(
    jwt.verify(refreshToken, process.env.JWT_SECRET || ""),
  );
  return validatedToken;
}

export {
  generateAccessToken,
  generateRefreshToken,
  decodeRefreshToken,
  decodeAccessToken,
};
