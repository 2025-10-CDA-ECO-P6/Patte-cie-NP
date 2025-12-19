import createHttpError from "http-errors";
import { AuditedBaseEntity } from "../../../core/bases/BaseModel";
import { VaccineType } from "./VaccinType.model";

export class Vaccine extends AuditedBaseEntity {
  private _vaccineTypeId!: string;
  private _name!: string;

  private _vaccineType?: VaccineType;

  constructor(props: {
    id: string;
    vaccineTypeId: string;
    name: string;
    createdAt: Date;
    updatedAt?: Date;
    isDeleted: boolean;
    vaccineType?: VaccineType;
  }) {
    super(props.id, props.createdAt, props.updatedAt, props.isDeleted);

    this.setVaccineTypeId(props.vaccineTypeId);
    this.setName(props.name);

    this._vaccineType = props.vaccineType;
  }

  get vaccineTypeId(): string {
    return this._vaccineTypeId;
  }

  get name(): string {
    return this._name;
  }

  get vaccineType(): VaccineType | undefined {
    return this._vaccineType;
  }

  setVaccineTypeId(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new createHttpError.BadRequest("vaccineTypeId is required");
    }
    this._vaccineTypeId = value;
  }

  setName(value: string): void {
    if (!value || value.trim().length < 2) {
      throw new createHttpError.BadRequest("Vaccine name must be at least 2 characters");
    }
    this._name = value.trim();
  }

  update(name: string, vaccineTypeId: string): void {
    this.setName(name);
    this.setVaccineTypeId(vaccineTypeId);
  }
}
