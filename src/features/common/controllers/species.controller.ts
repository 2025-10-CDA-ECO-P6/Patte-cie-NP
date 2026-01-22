import { SpeciesService, SpeciesResponseDTO, CreateSpeciesDTO, UpdateSpeciesDTO } from "../services/species.service";
import { BaseController, BaseControllerImpl } from "../../../core/bases/BaseController";

export interface SpeciesController extends BaseController {}

export const SpeciesControllerImpl = (speciesService: SpeciesService): SpeciesController => {
  return BaseControllerImpl<CreateSpeciesDTO, UpdateSpeciesDTO, SpeciesResponseDTO>(speciesService);
};
