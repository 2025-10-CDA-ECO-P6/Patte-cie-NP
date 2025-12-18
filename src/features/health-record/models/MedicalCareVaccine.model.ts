import { AuditedBaseEntity } from "../../../core/bases/BaseModel";
import { Vaccine } from "./Vaccine.model";

export class MedicalCareVaccine extends AuditedBaseEntity {
  readonly medicalCareId: string;
  readonly vaccineId: string;

  private _vaccine?: Vaccine;

  constructor(props: {
    id: string;
    medicalCareId: string;
    vaccineId: string;
    createdAt: Date;
    updatedAt?: Date;
    isDeleted: boolean;
    vaccine?: Vaccine;
  }) {
    super(props.id, props.createdAt, props.updatedAt, props.isDeleted);
    this.medicalCareId = props.medicalCareId;
    this.vaccineId = props.vaccineId;
    this._vaccine = props.vaccine;
  }

  static create(medicalCareId: string, vaccine: Vaccine): MedicalCareVaccine {
    return new MedicalCareVaccine({
      id: `${medicalCareId}_${vaccine.id}`,
      medicalCareId,
      vaccineId: vaccine.id,
      createdAt: new Date(),
      isDeleted: false,
      vaccine,
    });
  }

  get vaccine(): Vaccine | undefined {
    return this._vaccine;
  }
}