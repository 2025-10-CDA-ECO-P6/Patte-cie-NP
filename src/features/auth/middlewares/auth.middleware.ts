import { Request, Response, NextFunction } from "express"
import config from "../../../.config/config";
import jwt from "jsonwebtoken";


export const authenticationMiddleware = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const token = req.cookies.access_token;

        if (!token) {
            return res.status(401).json({ message: "Token missing" });
        }
        try {
            const decoded = jwt.verify(token, config.jwtSecret) as { sub: string };

            next();

        } catch {
            return res.status(401).json({ message: "Invalid token" });
        }
    }
}