import { VeterinarianResponseDTO, VeterinarianService, CreateVeterinarianDTO, UpdateVeterinarianDTO } from "../services/veterinarian.service";
import { Request, Response } from "express";

export const VeterinarianController = (
    veterinarianService: VeterinarianService
) => ({
    async getAll(_req: Request, res: Response) {
        try {
            const veterinarians: VeterinarianResponseDTO[] =
                await veterinarianService.getAll();
            res.json(veterinarians);
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    },

    async getById(req: Request, res: Response) {
        try {
            const veterinarian = await veterinarianService.getById(req.params.id);
            if (!veterinarian)
                return res.status(404).json({ message: "Veterinarian not found" });
            res.json(veterinarian);
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    },

    async create(req: Request, res: Response) {
        try {
            const dto: CreateVeterinarianDTO = req.body;
            const created: VeterinarianResponseDTO =
                await veterinarianService.create(dto);
            res.status(201).json(created);
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    },

    async update(req: Request, res: Response) {
        try {
            const dto: UpdateVeterinarianDTO = {
                id: req.params.id,
                ...req.body,
            };
            const updated: VeterinarianResponseDTO =
                await veterinarianService.update(dto);
            res.json(updated);
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    },

    async delete(req: Request, res: Response) {
        try {
            await veterinarianService.delete(req.params.id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    },
});
