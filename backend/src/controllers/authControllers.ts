import type { Response, Request } from "express";
import type { AuthResponse } from "../types";
import { asyncHandler, sendError, sendSuccess } from "../utils/responseHelpers";
import {
  signupSchema,
  signinSchema,
  resetPasswordSendOtpSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from "../schemas/auth";
import { DEFAULT_VALIDATION_ERROR_MESSAGE } from "../consts/consts";
import bcrypt from "bcrypt";
import { Resend } from "resend";
import { generateOtp } from "../utils/generateOtp";
import {
  decodeRefreshToken,
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateTokens";
import {
  accessTokenCookieExpiresAt,
  refreshTokenExpiresAt,
} from "../config/token";
import { User } from "../models/user";

//SIGN UP
const signUp = asyncHandler(async function signUp(req: Request, res: Response) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    sendError(res, "please provide name email and password", 400);
    return;
  }

  const validatedUserInput = signupSchema.safeParse(req.body);
  if (!validatedUserInput.success) {
    sendError(
      res,
      JSON.parse(validatedUserInput?.error?.message)[0].message ||
        DEFAULT_VALIDATION_ERROR_MESSAGE,
      400,
    );
    return;
  }

  const userDB = await User.findOne({
    email: validatedUserInput.data.email,
  });
  if (userDB) {
    sendError(res, "User already exists", 400);
    return;
  }

  const encryptedPassword = await bcrypt.hash(
    validatedUserInput.data.password,
    10,
  );
  validatedUserInput.data.password = encryptedPassword;
  const newUser = (await User.create(validatedUserInput.data)).toObject();

  const { password: _, ...newUserWithoutPassword } = newUser;

  const authResponse = {
    user: { ...newUserWithoutPassword, _id: newUser._id.toString() },
  };

  sendSuccess(res, authResponse, "User created successfully", 201);
});

// SIGN IN
const signIn = asyncHandler(async function signIn(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    sendError(res, "please provide email and password", 400);
    return;
  }

  const validatedUserInput = signinSchema.safeParse(req.body);
  if (!validatedUserInput.success) {
    sendError(
      res,
      JSON.parse(validatedUserInput?.error?.message)[0].message ||
        DEFAULT_VALIDATION_ERROR_MESSAGE,
      400,
    );
    return;
  }

  const userDB = (
    await User.findOne(
      { email: validatedUserInput.data.email },
      {
        verifiedOtp: 0,
        verifiedOtpExpiresAt: 0,
        refreshToken: 0,
        refreshTokenExpiresAt: 0,
      },
    )
  )?.toObject();
  if (!userDB) {
    sendError(res, "User not found", 404);
    return;
  }

  const isPasswordValid = await bcrypt.compare(
    validatedUserInput.data.password,
    userDB.password,
  );
  if (!isPasswordValid) {
    sendError(res, "Invalid credentials", 401);
    return;
  }

  const accessToken = generateAccessToken(userDB._id, userDB.email);
  const refreshToken = generateRefreshToken(userDB._id, userDB.email);

  // SET COOKIE TO BE SEND TO CLIENT BROWSER
  res.cookie("accessToken", accessToken, {
    httpOnly: true, //prevents access through javascript, document.cookie/ helps protect against CSRF attacks
    secure: process.env.NODE_ENV !== "development", //sends the cookies only through https
    sameSite: "strict", //prevents cross-site request forgery
    maxAge: accessTokenCookieExpiresAt, //15min / expire time of cookies
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, //prevents access through javascript, document.cookie/ helps protect against CSRF attacks
    secure: process.env.NODE_ENV !== "development", //sends the cookies only through https
    sameSite: "strict", //prevents cross-site request forgery
    maxAge: refreshTokenExpiresAt, //30 days / expire time of cookies
  });

  const encryptedRefreshToken = await bcrypt.hash(refreshToken, 10);

  await User.updateOne(
    { _id: userDB._id },
    {
      $set: {
        refreshToken: encryptedRefreshToken,
        refreshTokenExpiresAt: new Date(Date.now() + refreshTokenExpiresAt),
      },
    },
    {},
  );

  const { password: _, ...userWithoutPassword } = userDB;
  const userResponse: AuthResponse = {
    user: { ...userWithoutPassword, _id: userDB._id.toString() },
    // token: accessToken,
  };

  sendSuccess(res, userResponse, "User logged in successfully", 200);
});

const resend = new Resend(process.env.RESEND_API_KEY);

const sendOTPforgotPassword = asyncHandler(async function sendOTPforgotPassword(
  req: Request,
  res: Response,
) {
  const validatedUserInput = verifyEmailSchema.safeParse(req.body);

  if (!validatedUserInput.success) {
    sendError(
      res,
      JSON.parse(validatedUserInput?.error?.message)[0].message ||
        DEFAULT_VALIDATION_ERROR_MESSAGE,
      400,
    );
    return;
  }

  const userDB = (
    await User.findOne({ email: validatedUserInput?.data?.email })
  )?.toObject();
  if (!userDB) {
    sendError(res, "User not found", 404);
    return;
  }

  const otpCode = generateOtp();
  const { error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: [validatedUserInput.data.email],
    subject: "Reset Password with OTP",
    html: `<h2>Reset Password with OTP</h2>
    <h3><strong>Your OTP is: ${otpCode}</strong></h3>
    <p>The OTP will expire in 5 minutes</p> 
    `,
  });

  if (error) {
    sendError(res, error.message, 500);
    return;
  }
  const otpExpiresAt = Date.now() + 300000; //5min

  const updatedUserDB = (
    await User.findOneAndUpdate(
      { email: validatedUserInput?.data?.email },
      {
        otp: otpCode,
        otpExpiresAt: new Date(otpExpiresAt),
      },
    )
  )?.toObject();
  console.log("🚀 ~ sendOTPforgotPassword ~ otpCode:", otpCode);
  sendSuccess(res, updatedUserDB?.email, "OTP sent successfully", 200);

  // send the OTP email to this email
});

//VERIFY OTP
const verifyOTPforgotPassword = asyncHandler(
  async function verifyOTPforgotPassword(req: Request, res: Response) {
    const validatedUserInput = resetPasswordSendOtpSchema.safeParse(req.body);
    if (!validatedUserInput.success) {
      sendError(
        res,
        JSON.parse(validatedUserInput?.error?.message)[0].message ||
          DEFAULT_VALIDATION_ERROR_MESSAGE,
        400,
      );
      return;
    }

    const userDB = (
      await User.findOne({ email: validatedUserInput?.data?.email })
    )?.toObject();
    if (!userDB) {
      sendError(res, "User not found", 404);
      return;
    }

    if (userDB.otp !== validatedUserInput?.data?.otpCode) {
      sendError(res, "Invalid OTP", 400);
      return;
    }

    if (
      userDB?.otpExpiresAt &&
      new Date(userDB?.otpExpiresAt).getTime() < Date.now()
    ) {
      await User.findOneAndUpdate(
        { email: validatedUserInput?.data?.email },
        {
          verifiedOtp: false,
          otp: null,
          otpExpiresAt: null,
        },
      );
      sendError(res, "OTP expired", 400);
      return;
    }

    await User.findOneAndUpdate(
      { email: validatedUserInput?.data?.email },
      {
        verifiedOtp: true,
        otp: null,
        otpExpiresAt: null,
      },
    );

    sendSuccess(res, userDB?.email, "OTP verified successfully", 200);
  },
);

// RESET PASSWORD
const resetPassword = asyncHandler(async function resetPassword(
  req: Request,
  res: Response,
) {
  const validatedUserInput = resetPasswordSchema.safeParse(req.body);

  if (!validatedUserInput.success) {
    sendError(
      res,
      JSON.parse(validatedUserInput?.error?.message)[0].message ||
        DEFAULT_VALIDATION_ERROR_MESSAGE,
      400,
    );
    return;
  }

  const userDB = (
    await User.findOne({ email: validatedUserInput?.data?.email })
  )?.toObject();
  if (!userDB) {
    sendError(res, "User not found", 404);
    return;
  }
  if (!userDB?.verifiedOtp) {
    sendError(res, "OTP not verified, please try again", 403);
    return;
  }

  const encrytedPassword = await bcrypt.hash(
    validatedUserInput?.data?.newPassword,
    10,
  );

  await User.findOneAndUpdate(
    { email: validatedUserInput?.data?.newPassword },
    {
      password: encrytedPassword,
      verifiedOtp: false,
    },
  );

  sendSuccess(
    res,
    userDB?.email,
    "Password reset successfully, please login with your new password",
    200,
  );
});
// TODO
const logOut = asyncHandler(async function logOut(req: Request, res: Response) {
  // const userId = req.userId;

  // await User.findOneAndUpdate(
  //   { _id: userId },
  //   {
  //     refreshToken: null,
  //     refreshTokenExpiresAt: null,
  //   },
  // );

  res.clearCookie("refreshToken", {
    httpOnly: true, //prevents access through javascript, document.cookie/ helps protect against CSRF attacks
    secure: process.env.NODE_ENV !== "development", //sends the cookies only through https
    sameSite: "strict", //prevents cross-site request forgery
    maxAge: refreshTokenExpiresAt, //30 days / expire time of cookies
  });
  res.clearCookie("accessToken", {
    httpOnly: true, //prevents access through javascript, document.cookie/ helps protect against CSRF attacks
    secure: process.env.NODE_ENV !== "development", //sends the cookies only through https
    sameSite: "strict", //prevents cross-site request forgery
    maxAge: accessTokenCookieExpiresAt, //30 days / expire time of cookies
  });
  sendSuccess(res, null, "Logged out successfully", 200);
});
// REFRESH TOKEN
const refreshToken = asyncHandler(async function refreshToken(
  req: Request,
  res: Response,
) {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    sendError(res, "Unauthorized, please login", 401);
    return;
  }

  const decodedUserPayload = decodeRefreshToken(refreshToken);
  if (!decodedUserPayload) {
    sendError(res, "Invalid refresh token", 401); //TODO change to "Unauthorized"
    return;
  }

  const userDB = await User.findOne({
    _id: decodedUserPayload?.userId,
  });

  if (!userDB) {
    sendError(res, "Invalid refresh token", 401); //TODO change to "Unauthorized"
    return;
  }

  const tokenMatches = await bcrypt.compare(
    refreshToken,
    userDB?.refreshToken || "",
  );

  if (!tokenMatches) {
    sendError(res, "Doesnt match", 401); //TODO change to "Unauthorized"
    return;
  }

  if (
    userDB?.refreshTokenExpiresAt &&
    new Date(userDB?.refreshTokenExpiresAt).getTime() < Date.now()
  ) {
    sendError(res, "User session has expired", 401);
    return;
  }

  // GENERATE ACCESS TOKEN
  const accessToken = generateAccessToken(userDB?._id, userDB?.email);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
  });

  sendSuccess(res, "", "Token refreshed successfully", 204);
});

export {
  signUp,
  signIn,
  logOut,
  sendOTPforgotPassword,
  verifyOTPforgotPassword,
  resetPassword,
  refreshToken,
};

// TODO add  forgot password with OTP
// add logout to reset cookies accessToken and refreshToken
