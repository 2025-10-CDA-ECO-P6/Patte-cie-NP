import { Request, Response, NextFunction } from "express"
import config from "../../../.config/config";
import jwt from "jsonwebtoken";


export const authenticationMiddleware = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: "Authorization header missing" });
        }
        const token = authHeader.split(" ")[1]; // on split le token du header

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