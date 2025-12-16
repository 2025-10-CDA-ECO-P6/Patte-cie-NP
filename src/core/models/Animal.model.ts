import { AuditedBaseEntity } from "../bases/BaseModel";

export class Animal extends AuditedBaseEntity {
  readonly name: string;
  readonly birthDate: Date;
  readonly identification?: number;

  constructor(props: {
    id: string;
    name: string;
    birthDate: Date;
    identification?: number;
    createdAt: Date;
    updatedAt?: Date;
    isDeleted: boolean;
  }) {
    super(props.id, props.createdAt, props.updatedAt, props.isDeleted);
    this.name = props.name;
    this.birthDate = props.birthDate;
    this.identification = props.identification;
  }
}