import createHttpError from "http-errors";
import { AuditedBaseEntity } from "../../../core/bases/BaseModel";
import { VaccineType } from "./VaccinType.model";

export class Vaccine extends AuditedBaseEntity {
  private _vaccineTypeId!: string;
  private _vaccineType?: VaccineType;

  private _batchNumber?: string;
  private _doseNumber?: number;
  private _administrationDate!: Date;
  private _expirationDate!: Date;
  private _notes?: string;

  constructor(props: {
    id: string;
    vaccineTypeId: string;
    administrationDate: Date;
    expirationDate?: Date;
    batchNumber?: string;
    doseNumber?: number;
    notes?: string;
    createdAt: Date;
    updatedAt?: Date;
    isDeleted: boolean;
    vaccineType?: VaccineType;
  }) {
    super(props.id, props.createdAt, props.updatedAt, props.isDeleted);

    this.setVaccineTypeId(props.vaccineTypeId);
    this.setAdministrationDate(props.administrationDate);
    this.setExpirationDate(
      props.expirationDate ?? this.calculateExpiration(props.administrationDate, props.vaccineType),
    );
    this.setBatchNumber(props.batchNumber);
    this.setDoseNumber(props.doseNumber);
    this.setNotes(props.notes);

    this._vaccineType = props.vaccineType;
  }

  get vaccineTypeId(): string {
    return this._vaccineTypeId;
  }

  get vaccineType(): VaccineType | undefined {
    return this._vaccineType;
  }

  get batchNumber(): string | undefined {
    return this._batchNumber;
  }

  get doseNumber(): number | undefined {
    return this._doseNumber;
  }

  get administrationDate(): Date {
    return this._administrationDate;
  }

  get expirationDate(): Date {
    return this._expirationDate;
  }

  get notes(): string | undefined {
    return this._notes;
  }

  setVaccineTypeId(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new createHttpError.BadRequest("vaccineTypeId is required");
    }
    this._vaccineTypeId = value;
  }

  setBatchNumber(value?: string): void {
    this._batchNumber = value?.trim();
  }

  setDoseNumber(value?: number): void {
    if (value !== undefined && value <= 0) {
      throw new createHttpError.BadRequest("Dose number must be greater than 0");
    }
    this._doseNumber = value;
  }

  setAdministrationDate(date: Date): void {
    if (!date) throw new createHttpError.BadRequest("Administration date is required");
    this._administrationDate = date;
  }

  setExpirationDate(date: Date): void {
    if (!date) throw new createHttpError.BadRequest("Expiration date is required");
    this._expirationDate = date;
  }

  setNotes(notes?: string): void {
    this._notes = notes?.trim();
  }

  private calculateExpiration(administrationDate: Date, vaccineType?: VaccineType): Date {
    if (!vaccineType?.defaultValidityDays) {
      throw new createHttpError.BadRequest("Cannot calculate expiration: vaccine type validity missing");
    }
    const expiration = new Date(administrationDate);
    expiration.setDate(expiration.getDate() + vaccineType.defaultValidityDays);
    return expiration;
  }

  update(props: {
    vaccineTypeId?: string;
    administrationDate?: Date;
    expirationDate?: Date;
    batchNumber?: string;
    doseNumber?: number;
    notes?: string;
  }) {
    if (props.vaccineTypeId) this.setVaccineTypeId(props.vaccineTypeId);
    if (props.administrationDate) this.setAdministrationDate(props.administrationDate);
    if (props.expirationDate) this.setExpirationDate(props.expirationDate);
    if (props.batchNumber !== undefined) this.setBatchNumber(props.batchNumber);
    if (props.doseNumber !== undefined) this.setDoseNumber(props.doseNumber);
    if (props.notes !== undefined) this.setNotes(props.notes);
  }
}
