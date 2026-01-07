import dotenv from "dotenv";
dotenv.config();

type JwtExpiresIn = "1s" | "30s" | "1m" | "30m" | "1h" | "2h" | "1d";

if (!process.env.JWT_SECRET) {
  throw new Error("Missing environment variable: JWT_SECRET");
}
export const env = {
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN as JwtExpiresIn,
  PORT: process.env.PORT,
};
