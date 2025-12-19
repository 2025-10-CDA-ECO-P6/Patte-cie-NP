import { AuditedBaseEntity } from "../../../core/bases/BaseModel";
import { VaccineType } from "./VaccinType.model";

export class Vaccine extends AuditedBaseEntity {
  vaccineTypeId: string;
  name: string;

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
    this.vaccineTypeId = props.vaccineTypeId;
    this.name = props.name;
    this._vaccineType = props.vaccineType;
  }

  get vaccineType(): VaccineType | undefined {
    return this._vaccineType;
  }
}