import { Request, Response } from "express";
import { RoleService, CreateRoleDTO, RoleResponseDTO } from "../services/role.service";

export const RoleController = (roleService: RoleService) => ({
    async getAll(_req: Request, res: Response) {
        try {
            const roles: RoleResponseDTO[] = await roleService.getAll();
            res.json(roles);
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    },

    async getById(req: Request, res: Response) {
        try {
            const role = await roleService.getById(req.params.id);
            if (!role) return res.status(404).json({ message: "Role not found" });
            res.json(role);
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    },

    async create(req: Request, res: Response) {
        try {
            const dto: CreateRoleDTO = req.body;
            const created: RoleResponseDTO = await roleService.create(dto);
            res.status(201).json(created);
        } catch (error) {
            res.status(400).json({ message: (error as Error).message });
        }
    },
});
