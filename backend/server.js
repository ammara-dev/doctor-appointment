import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pathToFileURL } from "url";
dotenv.config();
import connectCloudinary from "./config/cloudinary.js";
import connectDB from "./config/mongodb.js";
import adminRouter from "./routes/adminRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import userRouter from "./routes/userRoute.js";

// app config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// middleware
app.use(express.json());
app.use(cors());

// api endpoints
app.use('/api/admin', adminRouter)
app.use('/api/doctor', doctorRouter)
app.use('/api/user', userRouter)

app.get("/", (req, res) => {
  res.send("API WORKNG Great");
});

const isLocalEntry = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isLocalEntry) {
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
}

export default app;
