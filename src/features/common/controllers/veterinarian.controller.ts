import { BaseController, BaseControllerImpl } from "../../../core/bases/BaseController";
import {
  VeterinarianResponseDTO,
  VeterinarianService,
  CreateVeterinarianDTO,
  UpdateVeterinarianDTO,
} from "../services/veterinarian.service";

export interface VeterinarianController extends BaseController {}

export const VeterinarianControllerImpl = (veterinarianService: VeterinarianService): VeterinarianController => {
  return BaseControllerImpl<CreateVeterinarianDTO, UpdateVeterinarianDTO, VeterinarianResponseDTO>(veterinarianService);
};
