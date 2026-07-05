// define the shape/validation for entity in DB

import { Schema, model } from "mongoose";
import type { MongodbUserType } from "../types";

const userSchema = new Schema<MongodbUserType>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    currency: {
      type: String,
      default: "EUR",
    },
    otp: {
      type: Number,
    },
    otpExpiresAt: {
      type: Date,
    },
    verifiedOtp: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
    },
    refreshTokenExpiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

export default userSchema;

export const User = model<MongodbUserType>("User", userSchema);
