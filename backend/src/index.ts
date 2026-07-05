import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

import { errorHandler } from "./middleware/errorHandler.js";
import { sendError } from "./utils/responseHelpers";

import { requireAuth } from "./middleware/authMiddleware";

// ROUTE DEFINITIONS
import expensesRoutes from "./routes/expensesRoutes";
import authRoutes from "./routes/authRoutes";
import profileRoutes from "./routes/profileRoutes";
import analyticsRoutes from "./routes/analyticsRoutes";
import { corsOptions } from "./config/origin";
import { connectDB } from "./config/mongoDBConnection";

const app: Application = express();
const PORT = process.env.PORT || 8000;

app.use(cors(corsOptions)); //configure cors middleware to add special headers to outgoing responses
app.use(express.json()); //parse incoming requests as json
app.use(cookieParser());

//ROUTE DEFINITIONS SYNC WITH SERVER
app.use("/api/auth", authRoutes);
app.use("/api/expenses", requireAuth, expensesRoutes);
app.use("/api/profile", requireAuth, profileRoutes);
app.use("/api/analytics", requireAuth, analyticsRoutes);
//

// request/route handler
// listens for the req from the client (browser/mobile app)
app.get("/", (req: Request, res: Response) => {
  console.log("hello", req.body);

  res.json({ message: "Hello from the backend" });
});

app.use((_, res) => {
  sendError(res, "Route not found", 404);
});

app.use(errorHandler); //last middleware which will catch any thrown errors

await connectDB();
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
  console.log(process.env.PORT ? ".env file loaded" : "default (8000)");
  console.log("Environment:", process.env.NODE_ENV);
});
