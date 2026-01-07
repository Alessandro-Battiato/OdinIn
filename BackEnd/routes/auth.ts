import { Router } from "express";
import { authController } from "../controllers/authController.js";
import passport from "passport";

const router = Router();

router.post("/signup", ...authController.postSignup);
router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  ...authController.postLogin
);
router.get(
  "/me",
  passport.authenticate("jwt", { session: false }),
  authController.me
);

export default router;
