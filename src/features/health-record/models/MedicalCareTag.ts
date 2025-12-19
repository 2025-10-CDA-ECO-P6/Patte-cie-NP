import createHttpError from "http-errors";
import { AuditedBaseEntity } from "../../../core/bases/BaseModel";
import { Tag } from "./Tag.model";

export class MedicalCareTag extends AuditedBaseEntity {
  private _medicalCareId!: string;
  private _tagId!: string;

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

    this.setMedicalCareId(props.medicalCareId);
    this.setTagId(props.tagId);

    this._tag = props.tag;
  }

  static create(medicalCareId: string, tag: Tag): MedicalCareTag {
    if (!medicalCareId || !tag?.id) {
      throw new createHttpError.BadRequest("Invalid MedicalCareId or Tag");
    }

    return new MedicalCareTag({
      id: `${medicalCareId}_${tag.id}`,
      medicalCareId,
      tagId: tag.id,
      createdAt: new Date(),
      isDeleted: false,
      tag,
    });
  }

  get medicalCareId(): string {
    return this._medicalCareId;
  }

  get tagId(): string {
    return this._tagId;
  }

  get tag(): Tag | undefined {
    return this._tag;
  }

  private setMedicalCareId(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new createHttpError.BadRequest("medicalCareId is required");
    }
    this._medicalCareId = value;
  }

  private setTagId(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new createHttpError.BadRequest("tagId is required");
    }
    this._tagId = value;
  }
}
