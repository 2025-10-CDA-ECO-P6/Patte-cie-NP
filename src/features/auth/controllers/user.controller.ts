import { Request, Response } from "express";
import { UserService, CreateUserDTO, UpdateUserDTO, UserResponseDTO, } from "../services/user.service";

export const UserController = (userService: UserService) => ({
    async getAll(_req: Request, res: Response) {
        try {
            const users: UserResponseDTO[] = await userService.getAll();
            res.json(users);
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    },

    async getById(req: Request, res: Response) {
        try {
            const user = await userService.getById(req.params.id);
            if (!user) return res.status(404).json({ message: "User not found" });
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    },

    async create(req: Request, res: Response) {
        try {
            const dto: CreateUserDTO = req.body;
            const created: UserResponseDTO = await userService.create(dto);
            res.status(201).json(created);
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    },

    async update(req: Request, res: Response) {
        try {
            const dto: UpdateUserDTO = { id: req.params.id, ...req.body };
            const updated: UserResponseDTO = await userService.update(dto);
            res.json(updated);
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    },

    async delete(req: Request, res: Response) {
        try {
            await userService.delete(req.params.id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    },
});
