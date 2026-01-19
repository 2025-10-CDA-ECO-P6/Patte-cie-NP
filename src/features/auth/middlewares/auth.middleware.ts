import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../../../.config/config";
import { prisma } from "../../../../lib/prisma";

interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
    };
}

interface JwtPayload {
    sub: string;
}

export const authenticationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.access_token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const payload = jwt.verify(
            token,
            config.jwtSecret
        ) as JwtPayload;

        // Vérification que l'utilisateur existe toujours

        const user = await prisma.user.findUnique({
            where: { id: payload.sub },
        });

        if (!user || user.isDeleted) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const authReq = req as AuthenticatedRequest;

        authReq.user = {
            id: payload.sub,
        };

        next();
    } catch {
        return res.status(401).json({ message: "Unauthorized" });
    }
};
