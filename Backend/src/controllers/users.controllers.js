import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/Users.model.js";

const registeruser = asyncHandler(async (req, res) => {
  const { username, email, name, password, mobile, role } = req.body;

  if ([username, email, name, password, mobile, role].some((field) => !field)) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({ $or: [{ username }, { email }, { mobile }] });
  if (existedUser) {
    throw new ApiError(409, "User with email or username or mobile number already exists");
  }

  const user = await User.create({
    username,
    email,
    name,
    password,
    mobile,
    role,
    verified: true, // Defaulting to true for MVP
  });

  const createdUser = await User.findById(user._id).select("-password");
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  const trimmedUsername = username?.trim() || "";
  const trimmedEmail = email?.trim() || "";

  if (!username && !email) {
    throw new ApiError(400, "Username or email is required");
  }

  // Allow login with either username or email, regardless of which field the frontend populates
  const identifier = trimmedUsername || trimmedEmail;

  const user = await User.findOne({
    $or: [{ username: identifier }, { email: identifier }]
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password?.trim());

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  const loggedInUser = await User.findById(user._id).select("-password -refresh_token");

  const options = {
    httpOnly: true,
    secure: false // Set to false for local development to ensure cookies are set
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser, accessToken, refreshToken
        },
        "User logged In Successfully"
      )
    );
});

export { registeruser, loginUser };