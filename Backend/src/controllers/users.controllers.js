import { ApiResonse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/users.model.js";
import {ApiError} from "../utils/ApiError.js";
const registeruser = asyncHandler(async (req, res) => {
  console.log("----DEBUG----");
  console.log("Content-Type:",)//req.headers["content-type"]);
  console.log("REQ BODY:", req.body);
  //console.log("REQ FILE:", req.files);
  console.log("--------------");

  const { username, email, fullname, password } = req.body;
  //validation
  if ([username, email, fullname, password].some((field) => !field)) {
    return res.status(400).json(new ApiResponse(false, "All fields are required"));
  }

  const existeduser=await User.findOne({$or:[{username},{email}]});

  if(existeduser){
    throw new ApiError(409,"User with email or username already exists");
  }
 const host = `${req.protocol}://${req.get("host")}`;

  // const avatarFile = req.files?.avatar?.[0];
  // const coverFile = req.files?.coverImage?.[0];

  // const avatarUrl = avatarFile
  //   ? `${host}/uploads/avatars/${avatarFile.filename}`
  //   : "";
  // const coverImageUrl = coverFile
  //   ? `${host}/uploads/coverImages/${coverFile.filename}`
  //   : "";

  // Create user
  const user = await User.create({
    username,
    email,
    fullname,
    password,
    avatar: avatarUrl,
    coverImage: coverImageUrl,
  });

  const createdUser = await User.findById(user._id).select("-password");
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

export { registeruser };
