import { AuditedBaseEntity } from "../../../core/bases/BaseModel";
import { MedicalCare } from "./MedicalCare.model";
import { Tag } from "./Tag.model";

export class MedicalCareTag extends AuditedBaseEntity {
  readonly medicalCareId: string;
  readonly tagId: string;

  private _tag?: Tag;

  constructor(props: {
    id: string;
    medicalCareId: string;
    tagId: string;
    createdAt: Date;
    updatedAt?: Date;
    isDeleted: boolean;
    tag?: Tag;
  }) {
    super(props.id, props.createdAt, props.updatedAt, props.isDeleted);
    this.medicalCareId = props.medicalCareId;
    this.tagId = props.tagId;
    this._tag = props.tag;
  }

  static create(medicalCareId: string, tag: Tag): MedicalCareTag {
    return new MedicalCareTag({
      id: `${medicalCareId}_${tag.id}`,
      medicalCareId,
      tagId: tag.id,
      createdAt: new Date(),
      isDeleted: false,
      tag,
    });
  }

  get tag(): Tag | undefined {
    return this._tag;
  }
}