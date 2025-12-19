import createHttpError from "http-errors";
import { AuditedBaseEntity } from "../../../core/bases/BaseModel";
import { MedicalCare } from "./MedicalCare.model";

export class HealthRecord extends AuditedBaseEntity {
  private _animalId!: string;
  private _description!: string;
  private _recordDate!: Date;

  private _medicalCares: MedicalCare[] = [];

  constructor(props: {
    id: string;
    animalId: string;
    description: string;
    recordDate: Date;
    createdAt: Date;
    updatedAt?: Date;
    isDeleted: boolean;
    medicalCares?: MedicalCare[];
  }) {
    super(props.id, props.createdAt, props.updatedAt, props.isDeleted);

    this.setAnimalId(props.animalId);
    this.setDescription(props.description);
    this.setRecordDate(props.recordDate);

    if (props.medicalCares) {
      this._medicalCares = [...props.medicalCares];
    }
  }

  get animalId(): string {
    return this._animalId;
  }

  get description(): string {
    return this._description;
  }

  get recordDate(): Date {
    return this._recordDate;
  }

  get medicalCares(): readonly MedicalCare[] {
    return this._medicalCares.filter((mc) => !mc.deleted);
  }

  setAnimalId(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new createHttpError.BadRequest("animalId is required");
    }
    this._animalId = value;
  }

  setDescription(value: string): void {
    if (!value || value.trim().length < 3) {
      throw new createHttpError.BadRequest("description must be at least 3 characters");
    }
    this._description = value;
  }

  setRecordDate(value: Date): void {
    if (!(value instanceof Date)) {
      throw new createHttpError.BadRequest("recordDate must be a valid Date");
    }

    if (value > new Date()) {
      throw new createHttpError.BadRequest("recordDate cannot be in the future");
    }

    this._recordDate = value;
  }

  update(description: string, recordDate: Date): void {
    this.setDescription(description);
    this.setRecordDate(recordDate);
  }

  addMedicalCare(medicalCare: MedicalCare): void {
    const exists = this._medicalCares.some((mc) => mc.id === medicalCare.id && !mc.deleted);

    if (exists) {
      throw new createHttpError.Conflict("MedicalCare already exists in HealthRecord");
    }

    this._medicalCares.push(medicalCare);
  }

  removeMedicalCare(medicalCareId: string): void {
    const medicalCare = this._medicalCares.find((mc) => mc.id === medicalCareId && !mc.deleted);

    if (!medicalCare) {
      throw new createHttpError.NotFound(`MedicalCare with id ${medicalCareId} not found in HealthRecord`);
    }

    medicalCare.markAsDeleted();
  }
}