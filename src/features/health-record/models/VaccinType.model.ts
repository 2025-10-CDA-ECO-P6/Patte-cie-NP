import { AuditedBaseEntity } from "../../../core/bases/BaseModel";
import { Vaccine } from "./Vaccine.model";

export class VaccineType extends AuditedBaseEntity {
  readonly name: string;

  private _vaccines: Vaccine[] = [];

  constructor(props: {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt?: Date;
    isDeleted: boolean;
    vaccines?: Vaccine[];
  }) {
    super(props.id, props.createdAt, props.updatedAt, props.isDeleted);
    this.name = props.name;
    if (props.vaccines) this._vaccines = props.vaccines;
  }

  get vaccines(): readonly Vaccine[] {
    return this._vaccines;
  }
}