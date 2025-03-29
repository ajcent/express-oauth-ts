import { Router } from "express";
import jwt from "jsonwebtoken";
import passport from "@/configs/passport-github";
import dotenv from "dotenv";

dotenv.config();
const router = Router();
const SECRET = process.env.JWT_SECRET as string;

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", { session: false }),
  async (req, res) => {
    try {
      const user = req.user as { id: string; email: string };

      const token = jwt.sign({ id: user.id, email: user.email }, SECRET, {
        expiresIn: "1h",
      });

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600000,
      });

      res.redirect("http://localhost:5173");
    } catch (error) {
      res.status(500).json({ error: "Authentication failed" });
    }
  }
);

export default router;
