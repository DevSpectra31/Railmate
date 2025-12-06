import dotenv from "dotenv"
dotenv.config({
    path: './.env'
})

console.log("ACCESS_TOKEN_SECRET:", process.env.ACCESS_TOKEN_SECRET ? "Exists" : "Missing");
console.log("REFRESH_TOKEN_SECRET:", process.env.REFRESH_TOKEN_SECRET ? "Exists" : "Missing");
console.log("ACCESS_TOKEN_EXPIRY:", process.env.ACCESS_TOKEN_EXPIRY ? "Exists" : "Missing");
console.log("REFRESH_TOKEN_EXPIRY:", process.env.REFRESH_TOKEN_EXPIRY ? "Exists" : "Missing");
console.log("MONGODB_URI:", process.env.MONGODB_URI ? "Exists" : "Missing");
