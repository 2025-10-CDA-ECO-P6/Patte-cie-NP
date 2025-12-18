import { AuditedBaseEntity } from "../../../core/bases/BaseModel";

export class VaccineType extends AuditedBaseEntity {
  readonly name: string;

  constructor(props: { id: string; name: string; createdAt: Date; updatedAt?: Date; isDeleted: boolean }) {
    super(props.id, props.createdAt, props.updatedAt, props.isDeleted);
    this.name = props.name;
  }
}
