import bcrypt from "bcrypt"; // comparer les mdps avec les hashés
import jwt from "jsonwebtoken"; // créer les tokens JWT
import { prisma } from "../../../../lib/prisma";
import config from "../../../.config/config";

export const AuthService = {
    async login(email: string, password: string) {

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user || user.isDeleted) {
            throw new Error("Invalid credentials");
        }

        // Vérification du mdp
        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            throw new Error("Invalid credentials");
        }

        // Création du token
        const accessToken = jwt.sign(
            {
                sub: user.id,
            },
            config.jwtSecret,
            {
                expiresIn: "15m",
            }
        );

        // Création du refresh token
        const refreshToken = jwt.sign(
            {
                sub: user.id,
            },
            config.jwtRefreshSecret,
            {
                expiresIn: "7d",
            }
        );

        // Sauvegarde du refresh token
        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });

        return {
            accessToken,
            refreshToken,
        };
    },
};
