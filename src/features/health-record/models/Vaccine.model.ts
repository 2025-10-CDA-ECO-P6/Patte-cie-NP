import { AuditedBaseEntity } from "../../../core/bases/BaseModel";
import { MedicalCareVaccine } from "./MedicalCareVaccine.model";
import { VaccineType } from "./VaccinType.model";

export class Vaccine extends AuditedBaseEntity {
  readonly vaccineTypeId: string;
  readonly name: string;

  private _vaccineType?: VaccineType;
  private _medicalCares: MedicalCareVaccine[] = [];

  constructor(props: {
    id: string;
    vaccineTypeId: string;
    name: string;
    createdAt: Date;
    updatedAt?: Date;
    isDeleted: boolean;
    vaccineType?: VaccineType;
    medicalCares?: MedicalCareVaccine[];
  }) {
    super(props.id, props.createdAt, props.updatedAt, props.isDeleted);
    this.vaccineTypeId = props.vaccineTypeId;
    this.name = props.name;
    this._vaccineType = props.vaccineType;
    if (props.medicalCares) this._medicalCares = props.medicalCares;
  }

  get vaccineType(): VaccineType | undefined {
    return this._vaccineType;
  }

  get medicalCares(): readonly MedicalCareVaccine[] {
    return this._medicalCares;
  }
}