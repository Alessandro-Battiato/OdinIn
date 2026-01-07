import type { SignOptions } from "jsonwebtoken";

import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const signJwt = (payload: object) => {
  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN,
  };

  return jwt.sign(payload, env.JWT_SECRET, options);
};