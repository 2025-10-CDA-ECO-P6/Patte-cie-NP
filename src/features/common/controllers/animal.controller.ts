import { AnimalResponseDTO, AnimalService, CreateAnimalDTO, UpdateAnimalDTO } from "../services/animal.service";
import { Request, Response } from "express";

export const AnimalController = (animalService: AnimalService) => ({
  async getAll(_req: Request, res: Response) {
    try {
      const animals: AnimalResponseDTO[] = await animalService.getAll();
      res.json(animals);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const animal = await animalService.getById(req.params.id);
      if (!animal) return res.status(404).json({ message: "Animal not found" });
      res.json(animal);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const dto: CreateAnimalDTO = req.body;
      const created: AnimalResponseDTO = await animalService.create(dto);
      res.status(201).json(created);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const dto: UpdateAnimalDTO = { id: req.params.id, ...req.body };
      const updated: AnimalResponseDTO = await animalService.update(dto);
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      await animalService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  },
});
