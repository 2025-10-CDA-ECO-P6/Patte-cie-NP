import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

export const AuthController = {
    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: "Missing credentials" });
            }

            const token = await AuthService.login(email, password);

            // stockage du token dans un cookie HttpOnly
            res.cookie("access_token", token, {
                httpOnly: true, // inaccessible via le front
                sameSite: "strict", // protection CSRF 
            });

            res.json({ message: "Logged in" });
        } catch {
            res.status(401).json({ message: "Invalid credentials" });
        }
    },
    async logout(_req: Request, res: Response) {
        res.clearCookie("access_token", {
            httpOnly: true,
            sameSite: "strict",
        });

        return res.status(204).send();
    },
};
