import "module-alias/register";

import express from "express";
import dotenv from "dotenv";

dotenv.config();

import authGithubRoutes from "@/routes/auth-github.routes";

const port = process.env.PORT || 8080;
const app = express();

app.use(express.json());

app.use("/auth", authGithubRoutes);

app.get("/", (_req, res) => {
  res.status(200).json({ msg: `Server is up and running` });
});

app.listen(port, () => {
  console.log(`Server is listening at port ${port}`);
});
