import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const healthcheck=asyncHandler(async(req,res)=>{
    return res
    .status(200)
    .json(new ApiResonse(200,"ok","health check passed"));

});
export {healthcheck};