import { OwnerService, OwnerResponseDTO, CreateOwnerDTO, UpdateOwnerDTO } from "../services/owner.service";
import { Request, Response } from "express";

export const OwnerController = (ownerService: OwnerService) => ({
  async getAll(_req: Request, res: Response) {
    try {
      const owners: OwnerResponseDTO[] = await ownerService.getAll();
      res.json(owners);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const owner = await ownerService.getById(req.params.id);
      if (!owner) return res.status(404).json({ message: "Owner not found" });
      res.json(owner);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const dto: CreateOwnerDTO = req.body;
      const created: OwnerResponseDTO = await ownerService.create(dto);
      res.status(201).json(created);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const dto: UpdateOwnerDTO = { id: req.params.id, ...req.body };
      const updated: OwnerResponseDTO = await ownerService.update(dto);
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      await ownerService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  },
});
