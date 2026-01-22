import { randomUUID } from "node:crypto";
import { Veterinarian } from "../models/veterinarian.model";
import { VeterinarianRepository } from "../repositories/veterinarian.repository";
import { BaseApiService, BaseApiServiceImpl } from "../../../core/bases/BaseApiService";
import createHttpError from "http-errors";

export interface VeterinarianService extends BaseApiService<
  Veterinarian,
  CreateVeterinarianDTO,
  UpdateVeterinarianDTO,
  VeterinarianResponseDTO
> {}

export const VeterinarianServiceImpl = (veterinarianRepository: VeterinarianRepository): VeterinarianService => {
  const toResponseDTO = (veterinarian: Veterinarian): VeterinarianResponseDTO => ({
    id: veterinarian.id,
    firstName: veterinarian.firstName,
    lastName: veterinarian.lastName,
    email: veterinarian.email,
    phone: veterinarian.phone,
    licenseNumber: veterinarian.licenseNumber,
  });

  const createDomain = (dto: CreateVeterinarianDTO): Veterinarian => {
    validateVeterinarianInput(dto);

    return new Veterinarian({
      id: randomUUID(),
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      phone: dto.phone,
      licenseNumber: dto.licenseNumber,
      createdAt: new Date(),
      isDeleted: false,
    });
  };

  const updateDomain = (existing: Veterinarian, dto: UpdateVeterinarianDTO): Veterinarian => {
    validateVeterinarianInput(dto, true);

    existing.update({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      phone: dto.phone,
      licenseNumber: dto.licenseNumber,
    });

    return existing;
  };

  return BaseApiServiceImpl(
    veterinarianRepository,
    toResponseDTO,
    createDomain,
    updateDomain,
    validateVeterinarianInput,
    (dto: VeterinarianResponseDTO) => {
      if (!dto.id || !dto.email) {
        throw new createHttpError.InternalServerError("Invalid veterinarian response");
      }
    },
  );
};

export interface CreateVeterinarianDTO {
  firstName: string;
  lastName: string;
  email: string;
  phone: number;
  licenseNumber: string;
}

export interface UpdateVeterinarianDTO {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: number;
  licenseNumber?: string;
}

export interface VeterinarianResponseDTO {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: number;
  licenseNumber: string;


}

const validateVeterinarianInput = (
  dto: CreateVeterinarianDTO | UpdateVeterinarianDTO,
  partial = false
) => {
  if (!partial || dto.firstName !== undefined) {
    if (!dto.firstName?.trim()) {
      throw new createHttpError.BadRequest("First name is required");
    }
  }

  if (!partial || dto.lastName !== undefined) {
    if (!dto.lastName?.trim()) {
      throw new createHttpError.BadRequest("Last name is required");
    }
  }

  if (!partial || dto.email !== undefined) {
    if (
      !dto.email ||
      !/\S+@\S+\.\S+/.test(dto.email)
    ) {
      throw new createHttpError.BadRequest("Email is invalid");
    }
  }

  if (!partial || dto.licenseNumber !== undefined) {
    if (!dto.licenseNumber?.trim()) {
      throw new createHttpError.BadRequest("License number is required");
    }
  }
};