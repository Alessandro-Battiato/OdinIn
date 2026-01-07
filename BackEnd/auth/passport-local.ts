import type { User } from "../generated/prisma/client.js";

import { Strategy } from "passport-local";
import bcrypt from "bcrypt";
import prisma from "../prisma.js";

type Done = (error: Error | null, user?: User | false, info?: { message: string }) => void;

export const localStrategy = new Strategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  async (email: string, password: string, done: Done) => {
    try {
      const user = await prisma.user.findUnique({ where: { email }});

      if (!user) return done(null, false, { message: "Invalid credentials" });

      const isValid = await bcrypt.compare(password, user.password);

      if (!isValid) return done(null, false, { message: "Invalid credentials" });

      return done(null, user);
    } catch (err) {
      return done(err as Error);
    }
  }
);