import { BaseController, BaseControllerImpl } from "../../../core/bases/BaseController";
import { OwnerService, OwnerResponseDTO, CreateOwnerDTO, UpdateOwnerDTO } from "../services/owner.service";

export interface OwnerController extends BaseController {}

export const OwnerControllerImpl = (ownerService: OwnerService): OwnerController => {
  return BaseControllerImpl<CreateOwnerDTO, UpdateOwnerDTO, OwnerResponseDTO>(ownerService);
};