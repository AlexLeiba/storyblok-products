import type { Response, Request } from "express";
import type { AuthResponse } from "../types";
import {
  asyncHandler,
  sendError,
  sendSuccess,
} from "../utils/responseHelpers.js";
import { DEFAULT_VALIDATION_ERROR_MESSAGE } from "../consts/consts";
import { updateProfileSchema } from "../schemas/profile";
import { User } from "../models/User";
import bcrypt from "bcrypt";

// GET PROFILE
const getProfile = asyncHandler(async function getProfile(
  req: Request,
  res: Response,
) {
  const userId = req.userId;

  if (!userId) {
    sendError(res, "Anauthorized", 401);
    return;
  }

  //   check if user exists
  const userDB = (
    await User.findOne(
      { _id: userId },
      {
        password: 0,
        verifiedOtp: 0,
        verifiedOtpExpiresAt: 0,
        verifiedOtpToken: 0,
        refreshToken: 0,
        refreshTokenExpiresAt: 0,
      },
    )
  )?.toObject();
  if (!userDB) {
    return sendError(res, "User not found", 404);
  }

  const userResponse: AuthResponse = {
    user: { ...userDB, _id: userDB._id.toString() },
  };

  sendSuccess(res, userResponse, "User profile retrieved successfully", 200);
});

// UPDATE PROFILE
const updateProfile = asyncHandler(async function updateProfile(
  req: Request,
  res: Response,
) {
  const userId = req.userId;

  if (!userId) {
    return sendError(res, "Anauthorized", 401);
  }
  const { name, password } = req.body;

  if (!name && !password) {
    return sendError(res, "Please provide at least one field to update", 400);
  }

  const validatedUserInput = updateProfileSchema.safeParse(req.body);
  if (!validatedUserInput.success) {
    sendError(
      res,
      JSON.parse(validatedUserInput?.error?.message)[0].message ||
        DEFAULT_VALIDATION_ERROR_MESSAGE,
      400,
    );
    return;
  }

  const userDB = (await User.findOne({ _id: userId }))?.toObject();
  if (!userDB) {
    return sendError(res, "User not found", 404);
  }

  const updatedData = {
    name: validatedUserInput.data.name || userDB.name,
    password: userDB.password,
    currency: validatedUserInput.data.currency || userDB.currency,
  };

  if (validatedUserInput.data.password) {
    const encryptedPassword = await bcrypt.hash(
      validatedUserInput.data.password,
      10,
    );
    updatedData.password = encryptedPassword;
  }
  const updatedUserData = await User.findOneAndUpdate(
    { _id: userId },
    { $set: updatedData },
    {
      new: true,
      select: {
        password: 0,
        verifiedOtp: 0,
        verifiedOtpExpiresAt: 0,
        refreshToken: 0,
        refreshTokenExpiresAt: 0,
      },
    },
  );

  if (!updatedUserData) {
    return sendError(res, "User not found", 404);
  }

  const userResponse: AuthResponse = {
    user: {
      ...updatedUserData?.toObject(),
      _id: updatedUserData?._id.toString(),
    },
  };

  sendSuccess(res, userResponse, "Profile updated successfully", 200);
});

export { getProfile, updateProfile };

// upload/remove/ use a default avatar based on userID avatar ( with cloudinary)
