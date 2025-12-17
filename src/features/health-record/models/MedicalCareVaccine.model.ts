import { AuditedBaseEntity } from "../../../core/bases/BaseModel";
import { MedicalCare } from "./MedicalCare.model";
import { Vaccine } from "./Vaccine.model";

export class MedicalCareVaccine extends AuditedBaseEntity {
  readonly medicalCareId: string;
  readonly vaccineId: string;

  private _medicalCare?: MedicalCare;
  private _vaccine?: Vaccine;

  constructor(props: {
    id: string;
    medicalCareId: string;
    vaccineId: string;
    createdAt: Date;
    updatedAt?: Date;
    isDeleted: boolean;
    medicalCare?: MedicalCare;
    vaccine?: Vaccine;
  }) {
    super(props.id, props.createdAt, props.updatedAt, props.isDeleted);
    this.medicalCareId = props.medicalCareId;
    this.vaccineId = props.vaccineId;
    this._medicalCare = props.medicalCare;
    this._vaccine = props.vaccine;
  }

  get medicalCare(): MedicalCare | undefined {
    return this._medicalCare;
  }

  get vaccine(): Vaccine | undefined {
    return this._vaccine;
  }
}