import { User } from "../models/User.model";
import { UserRepository } from "../repositories/user.repository";
import bcrypt from "bcrypt";

export class UserService {
    constructor(private readonly userRepository: UserRepository) { }

    async getUserById(id: string): Promise<User | null> {
        return this.userRepository.getById(id);
    }

    async getUserByEmail(email: string): Promise<User | null> {
        return this.userRepository.getByEmail(email);
    }

    async createUser(email: string, password: string, roleId: string): Promise<User> {

        // Vérifier si l'email existe déjà
        const existing = await this.userRepository.getByEmail(email);

        if (existing) {
            throw new Error("Email already in use");
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Créer l'entité métier User
        const user = new User({
            id: crypto.randomUUID(),
            email,
            password: hashedPassword,
            roleId,
            createdAt: new Date(),
            isDeleted: false,
        });

        // Sauvegarder via le repository
        return this.userRepository.create(user);
    }
}
