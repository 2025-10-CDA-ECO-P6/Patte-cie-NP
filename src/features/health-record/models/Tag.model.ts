import createHttpError from "http-errors";
import { AuditedBaseEntity } from "../../../core/bases/BaseModel";

export class Tag extends AuditedBaseEntity {
  private _name!: string;

  constructor(props: { id: string; name: string; createdAt: Date; updatedAt?: Date; isDeleted: boolean }) {
    super(props.id, props.createdAt, props.updatedAt, props.isDeleted);
    this.setName(props.name);
  }

  get name(): string {
    return this._name;
  }

  setName(value: string): void {
    if (!value || value.trim().length < 2) {
      throw new createHttpError.BadRequest("Tag name must be at least 2 characters");
    }
    this._name = value.trim();
  }

  updateName(newName: string): void {
    this.setName(newName);
  }
}
