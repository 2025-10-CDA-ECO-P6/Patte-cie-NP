import { randomUUID } from "node:crypto";
import { Owner } from "../models/Owner.model";
import { OwnerRepository } from "../repositories/owner.repository";
import createHttpError from "http-errors";
import { BaseApiService, BaseApiServiceImpl } from "../../../core/bases/BaseApiService";

export interface OwnerService extends BaseApiService<Owner, CreateOwnerDTO, UpdateOwnerDTO, OwnerResponseDTO> {}

export const OwnerServiceImpl = (
  ownerRepository: OwnerRepository
): OwnerService => {
  const toResponseDTO = (owner: Owner): OwnerResponseDTO => ({
    id: owner.id,
    firstName: owner.firstName,
    lastName: owner.lastName,
    email: owner.email,
    address: owner.address,
    phoneNumber: owner.phoneNumber,
  });

  const createDomain = (dto: CreateOwnerDTO): Owner => {
    validateOwnerInput(dto);

    return new Owner({
      id: randomUUID(),
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      address: dto.address,
      phoneNumber: dto.phoneNumber,
      createdAt: new Date(),
      isDeleted: false,
    });
  };

  const updateDomain = (existing: Owner, dto: UpdateOwnerDTO): Owner => {
    validateOwnerInput(dto, true);

    existing.update({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      address: dto.address,
      phoneNumber: dto.phoneNumber,
    });

    return existing;
  };

  const baseService = BaseApiServiceImpl(
    ownerRepository,
    toResponseDTO,
    createDomain,
    updateDomain,
    validateOwnerInput,
    (dto: OwnerResponseDTO) => {
      if (!dto.id || !dto.firstName || !dto.lastName || !dto.email) {
        throw new createHttpError.InternalServerError("Invalid owner response");
      }
    },
  );

  return {
    ...baseService,
  };
};

export interface CreateOwnerDTO {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  phoneNumber: number;
}

export interface UpdateOwnerDTO {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  address?: string;
  phoneNumber?: number;
}

export interface OwnerResponseDTO {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  phoneNumber: number;
}

const validateOwnerInput = (dto: CreateOwnerDTO | UpdateOwnerDTO, partial = false) => {
  if (!partial || dto.firstName !== undefined) {
    if (!dto.firstName || typeof dto.firstName !== "string")
      throw new createHttpError.BadRequest("firstName is required");
  }
  if (!partial || dto.lastName !== undefined) {
    if (!dto.lastName || typeof dto.lastName !== "string") throw new createHttpError.BadRequest("lastName is required");
  }
  if (!partial || dto.email !== undefined) {
    if (!dto.email || typeof dto.email !== "string" || !/\S+@\S+\.\S+/.test(dto.email))
      throw new createHttpError.BadRequest("email is required and must be valid");
  }
  if (!partial || dto.address !== undefined) {
    if (!dto.address || typeof dto.address !== "string") throw new createHttpError.BadRequest("address is required");
  }
  if (!partial || dto.phoneNumber !== undefined) {
    if (dto.phoneNumber === undefined || typeof dto.phoneNumber !== "number")
      throw new createHttpError.BadRequest("phoneNumber is required and must be a number");
  }
};