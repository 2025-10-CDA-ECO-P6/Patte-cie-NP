import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../../../.config/config";

interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
    };
}

interface JwtPayload {
    sub: string;
}

export const authenticationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.access_token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const payload = jwt.verify(
            token,
            config.jwtSecret
        ) as JwtPayload;

        const authReq = req as AuthenticatedRequest;

        authReq.user = {
            id: payload.sub,
        };

        next();
    } catch {
        return res.status(401).json({ message: "Unauthorized" });
    }
};
