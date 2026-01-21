import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { prisma } from "../../../../lib/prisma";

export const AuthController = {
    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: "Missing credentials" });
            }

            const { accessToken, refreshToken } = await AuthService.login(email, password);

            // stockage du token dans un cookie HttpOnly
            res.cookie("access_token", accessToken, {
                httpOnly: true, // inaccessible via le front
                sameSite: "strict", // protection CSRF 
                path: "/",
            });

            res.cookie("refresh_token", refreshToken, {
                httpOnly: true,
                sameSite: "strict",
                path: "/auth/refresh",
            });

            res.json({ message: "Logged in" });
        } catch {
            res.status(401).json({ message: "Invalid credentials" });
        }
    },

    async register(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: "Missing email or password" });
            }

            const user = await AuthService.register(email, password);
            return res.status(201).json(user);
        } catch (err: any) {
            return res.status(400).json({ message: err.message });
        }
    },

    async refresh(req: Request, res: Response) {
        try {
            const refreshToken = req.cookies.refresh_token;

            if (!refreshToken) {
                return res.status(401).json({ message: "Missing refresh token" });
            }

            const newAccessToken = await AuthService.refresh(refreshToken);

            res.cookie("access_token", newAccessToken, {
                httpOnly: true,
                sameSite: "strict",
                path: "/",
            });

            res.json({ message: "Token refreshed" });
        } catch {
            res.status(401).json({ message: "Invalid refresh token" });
        }
    },

    async logout(req: Request, res: Response) {
        const refreshToken = req.cookies.refresh_token;

        if (refreshToken) {
            // Supprime le refresh token de la BDD
            await prisma.refreshToken.deleteMany({
                where: { token: refreshToken },
            });
        }

        // Supprime les cookies
        res.clearCookie("access_token", { path: "/" });
        res.clearCookie("refresh_token", { path: "/auth/refresh" })
        return res.status(204).send();
    },
};
