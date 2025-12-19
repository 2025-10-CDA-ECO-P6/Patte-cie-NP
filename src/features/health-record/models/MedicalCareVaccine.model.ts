import createHttpError from "http-errors";
import { AuditedBaseEntity } from "../../../core/bases/BaseModel";
import { Vaccine } from "./Vaccine.model";

export class MedicalCareVaccine extends AuditedBaseEntity {
  private _medicalCareId!: string;
  private _vaccineId!: string;

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

    this.setMedicalCareId(props.medicalCareId);
    this.setVaccineId(props.vaccineId);

    this._vaccine = props.vaccine;
  }

  static create(medicalCareId: string, vaccine: Vaccine): MedicalCareVaccine {
    if (!medicalCareId || !vaccine?.id) {
      throw new createHttpError.BadRequest("Invalid MedicalCareId or Vaccine");
    }

    return new MedicalCareVaccine({
      id: `${medicalCareId}_${vaccine.id}`,
      medicalCareId,
      vaccineId: vaccine.id,
      createdAt: new Date(),
      isDeleted: false,
      vaccine,
    });
  }

  get medicalCareId(): string {
    return this._medicalCareId;
  }

  get vaccineId(): string {
    return this._vaccineId;
  }

  get vaccine(): Vaccine | undefined {
    return this._vaccine;
  }

  private setMedicalCareId(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new createHttpError.BadRequest("medicalCareId is required");
    }
    this._medicalCareId = value;
  }

  private setVaccineId(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new createHttpError.BadRequest("vaccineId is required");
    }
    this._vaccineId = value;
  }
}