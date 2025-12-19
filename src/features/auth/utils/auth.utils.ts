import jwt from "jsonwebtoken";
import config from "../../../.config/config";

export function generateAccessToken(userId: string): string {
    return jwt.sign(
        { sub: userId },
        config.jwtSecret!,
        { expiresIn: "15m" }
    );
}

export function generateRefreshToken(userId: string): string {
    return jwt.sign(
        {
            sub: userId,
            type: "refresh",
        },
        config.jwtRefreshSecret!,
        {
            expiresIn: "7d",
        }
    );
}
