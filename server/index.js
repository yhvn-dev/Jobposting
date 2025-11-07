import express from "express";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const port = process.env.APP_PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import userRoutes from "./routes/userRoutes.js";
app.use("/api/user", userRoutes);

app.listen(port, () => {
  console.log("listening on the port", port);
});
