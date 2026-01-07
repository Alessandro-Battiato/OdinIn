import type { Request, Response } from "express";
import type { User } from "../generated/prisma/client.js";

import bcrypt from "bcrypt";
import prisma from "../prisma.js";
import { signJwt } from "../auth/signJwt.js";
import { body, validationResult, matchedData } from "express-validator";

const validateSignup = [
  body("email")
    .isEmail()
    .withMessage("A valid email is required"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required"),

  body("surname")
    .trim()
    .notEmpty()
    .withMessage("Surname is required"),
];

const validateLogin = [
  body("email")
    .isEmail()
    .withMessage("Email is required"),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];

const signup = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const fields = matchedData(req, { onlyValidData: false });
    return res.status(400).json({ errors: errors.mapped(), fields });
  }

  try {
    const { email, password, name, surname } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing)
      return res.status(400).json({ message: "Email already in use" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { email, password: hashed, name, surname },
    });

    const token = signJwt({ id: user.id });

    return res.status(201).json({ user, token });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal error" });
  }
};

const login = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const fields = matchedData(req, { onlyValidData: false });
    return res.status(400).json({ errors: errors.mapped(), fields });
  }
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const user = req.user as User;
  const token = signJwt({ id: user.id });

  return res.json({ user, token });
};

const me = async (req: Request, res: Response) => {
  return res.json(req.user);
};

export const authController = {
  postSignup: [validateSignup, signup],
  postLogin: [validateLogin, login],
  me,
};

export { signup, login, me };
