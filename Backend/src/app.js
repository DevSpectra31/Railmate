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
import paymentRouter from "./routes/payment.routes.js";

const app = express();
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        // Allow any localhost origin for development
        if (origin.includes("localhost") || origin.includes("127.0.0.1")) {
            return callback(null, true);
        }

        // Use env var for production or specific allowed origins
        const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173").split(",");
        if (allowedOrigins.indexOf(origin) !== -1) {
            return callback(null, true);
        }

        return callback(new Error('Not allowed by CORS'));
    },
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
app.use("/api/v1/payment", paymentRouter);

import { errorHandler } from "./middlewares/error.middleware.js";
app.use(errorHandler);

export { app };