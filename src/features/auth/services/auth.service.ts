import bcrypt from "bcrypt"; // comparer les mdps avec les hashés
import jwt from "jsonwebtoken"; // créer les tokens JWT
import { prisma } from "../../../../lib/prisma";

export const AuthService = {
    async login(email: string, password: string): Promise<string> {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user || user.isDeleted) {
            throw new Error("Invalid credentials");
        }

        //  vérification du mot de passe
        const isValid =
            user.password === password ||
            (await bcrypt.compare(password, user.password));

        if (!isValid) {
            throw new Error("Invalid credentials");
        }

        // création du token
        return jwt.sign(
            {
                sub: user.id,
            },
            process.env.JWT_SECRET!,
            { expiresIn: "15m" }
        );
    },
};
