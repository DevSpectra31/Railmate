import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import Userrouter from "./routes/user.routes.js";
import healthcheck from "./routes/healthcheck.routes.js";
import parcelRouter from "./routes/parcel.routes.js";
import orderRouter from "./routes/order.routes.js";
import productRouter from "./routes/product.routes.js";
import stationRouter from "./routes/station.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";

const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN === "*" ? "http://localhost:5173" : (process.env.CORS_ORIGIN || "http://localhost:5173"),
    credentials: true
}));

// express common middlewares
app.use(express.json({ limit: '16kb' }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(cookieParser());

//routes declaration 
app.use("/api/v1/healthcheck", healthcheck);
app.use("/api/v1/users", Userrouter); // /register /login
app.use("/api/v1/parcels", parcelRouter); // /create /status/:id
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/stations", stationRouter);
app.use("/api/v1/dashboard", dashboardRouter);

import { errorHandler } from "./middlewares/error.middleware.js";
app.use(errorHandler);

export { app };