import { get } from "node:http";
import { Veterinarian } from "../models/veterinarian.model";
import { VeterinarianRepository } from "../repositories/veterinarian.repository";

export const VeterinarianService = {
    // Veterinarian by id
    getOneVeterinarian: (id: string): Veterinarian => {
        const veterinarian = VeterinarianRepository.getOneVeterinarian(id);
        return veterinarian;
    },

    async getAll(): Promise<Veterinarian[]> {
        return await VeterinarianRepository.getAllVeterinarians();
    }

}