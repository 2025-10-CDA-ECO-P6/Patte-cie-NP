import createHttpError from "http-errors";
import { AuditedBaseEntity } from "../../../core/bases/BaseModel";

export class VaccineType extends AuditedBaseEntity {
  private _name!: string;
  private _defaultValidityDays?: number;
  private _notes?: string;

  constructor(props: {
    id: string;
    name: string;
    defaultValidityDays?: number;
    notes?: string;
    createdAt: Date;
    updatedAt?: Date;
    isDeleted: boolean;
  }) {
    super(props.id, props.createdAt, props.updatedAt, props.isDeleted);

    this.setName(props.name);
    this.setDefaultValidityDays(props.defaultValidityDays);
    this.setNotes(props.notes);
  }

  get name(): string {
    return this._name;
  }

  get defaultValidityDays(): number | undefined {
    return this._defaultValidityDays;
  }

  get notes(): string | undefined {
    return this._notes;
  }

  setName(value: string): void {
    if (!value || value.trim().length < 2) {
      throw new createHttpError.BadRequest("VaccineType name must be at least 2 characters");
    }
    this._name = value.trim();
  }

  setDefaultValidityDays(days?: number): void {
    if (days !== undefined && days <= 0) {
      throw new createHttpError.BadRequest("Default validity days must be greater than 0");
    }
    this._defaultValidityDays = days;
  }

  setNotes(notes?: string): void {
    this._notes = notes?.trim();
  }

  update(props: { name?: string; defaultValidityDays?: number; notes?: string }) {
    if (props.name) this.setName(props.name);
    if (props.defaultValidityDays !== undefined) this.setDefaultValidityDays(props.defaultValidityDays);
    if (props.notes !== undefined) this.setNotes(props.notes);
  }
}