import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/Users.model.js";

const registeruser = asyncHandler(async (req, res) => {
  console.log("----DEBUG----");
  console.log("REQ BODY:", req.body);
  //console.log("REQ FILE:", req.files);
  console.log("--------------");

  const { username, email, name, password ,mobile,verified} = req.body;

  if ([username, email, name, password,mobile,verified].some((field) => !field)) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({ $or: [{ username }, { email },{mobile}] });
  if (existedUser) {
    throw new ApiError(409, "User with email or username or mobile number already exists");
  }

      const user = await User.create({
        username,
        email,
        name,
        password,
        mobile,
        verified,
        //  avatar: avatarUpload.secure_url,
        //  coverImage: coverUpload?.secure_url || "",
      });
    
       const createdUser = await User.findOne(user._id).select("-password");
       if (!createdUser) {
         throw new ApiError(500, "Something went wrong while registering user");
       }
    
      return res
        .status(201)
        .json(new ApiResponse(201, createdUser, "User registered successfully"));
});
export{registeruser};