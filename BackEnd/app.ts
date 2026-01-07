import type { Request, Response } from 'express';

import express from "express";
import cors from "cors";
import passport from "passport";
import router from "./routes/auth.js";

import { localStrategy } from "./auth/passport-local.js";
import { jwtStrategy } from "./auth/passport-jwt.js";

const app = express();

app.use(cors());
app.use(express.json());

passport.use(localStrategy);
passport.use(jwtStrategy);
app.use(passport.initialize());

app.use("/auth", router);

app.get("/", (req: Request, res: Response) => res.send("API Running"));

export default app;