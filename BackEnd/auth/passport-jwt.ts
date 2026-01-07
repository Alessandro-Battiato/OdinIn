import type { JwtPayload as JwtPayloadBase } from "jsonwebtoken";

import { Strategy, ExtractJwt } from "passport-jwt";
import prisma from "../prisma.js";
import { env } from "../config/env.js";

interface JwtPayload extends JwtPayloadBase {
  id: string;
}

type PassportDone = (
  error: unknown,
  user?: unknown | false,
  info?: unknown
) => void;

export const jwtStrategy = new Strategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: env.JWT_SECRET!,
  },
  async (payload: JwtPayload, done: PassportDone) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: payload.id },
      });

      if (!user) return done(null, false);

      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  }
);
