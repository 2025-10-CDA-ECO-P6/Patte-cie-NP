import { AuditedBaseEntity } from "../bases/BaseModel";

export class AnimalOwner extends AuditedBaseEntity {
  readonly animalId: string;
  readonly ownerId: string;
  readonly startDate: Date;
  readonly endDate?: Date;

  constructor(props: {
    id: string;
    animalId: string;
    ownerId: string;
    startDate: Date;
    endDate?: Date;
    createdAt: Date;
    updatedAt?: Date;
    isDeleted: boolean;
  }) {
    super(props.id, props.createdAt, props.updatedAt, props.isDeleted);
    this.animalId = props.animalId;
    this.ownerId = props.ownerId;
    this.startDate = props.startDate;
    this.endDate = props.endDate;
  }
}
