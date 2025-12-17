import { AuditedBaseEntity } from "../../../core/bases/BaseModel";
import { MedicalCare } from "./MedicalCare.model";
import { Tag } from "./Tag.model";

export class MedicalCareTag extends AuditedBaseEntity {
  readonly medicalCareId: string;
  readonly tagId: string;

  private _medicalCare?: MedicalCare;
  private _tag?: Tag;

  constructor(props: {
    id: string;
    medicalCareId: string;
    tagId: string;
    createdAt: Date;
    updatedAt?: Date;
    isDeleted: boolean;
    medicalCare?: MedicalCare;
    tag?: Tag;
  }) {
    super(props.id, props.createdAt, props.updatedAt, props.isDeleted);
    this.medicalCareId = props.medicalCareId;
    this.tagId = props.tagId;
    this._medicalCare = props.medicalCare;
    this._tag = props.tag;
  }

  get medicalCare(): MedicalCare | undefined {
    return this._medicalCare;
  }

  get tag(): Tag | undefined {
    return this._tag;
  }
}