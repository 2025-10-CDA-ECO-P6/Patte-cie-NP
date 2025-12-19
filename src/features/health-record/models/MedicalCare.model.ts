import { AuditedBaseEntity } from "../../../core/bases/BaseModel";
import { Veterinarian } from "../../../core/models/veterinarian.model";
import { HealthRecord } from "./HealthRecord.model";
import { MedicalCareTag } from "./MedicalCareTag";
import { MedicalCareVaccine } from "./MedicalCareVaccine.model";
import { Tag } from "./Tag.model";
import { Vaccine } from "./Vaccine.model";

export class MedicalCare extends AuditedBaseEntity {
  healthRecordId: string;
  veterinarianId: string;
  type: string;
  description: string;
  careDate: Date;

  private _healthRecord?: HealthRecord;
  private _veterinarian?: Veterinarian;

  private _tags: MedicalCareTag[] = [];
  private _vaccines: MedicalCareVaccine[] = [];

  constructor(props: {
    id: string;
    healthRecordId: string;
    veterinarianId: string;
    type: string;
    description: string;
    careDate: Date;
    createdAt: Date;
    updatedAt?: Date;
    isDeleted: boolean;
    healthRecord?: HealthRecord;
    veterinarian?: Veterinarian;
    tags?: MedicalCareTag[];
    vaccines?: MedicalCareVaccine[];
  }) {
    super(props.id, props.createdAt, props.updatedAt, props.isDeleted);

    this.healthRecordId = props.healthRecordId;
    this.veterinarianId = props.veterinarianId;
    this.type = props.type;
    this.description = props.description;
    this.careDate = props.careDate;

    this._healthRecord = props.healthRecord;
    this._veterinarian = props.veterinarian;

    if (props.tags) this._tags = props.tags;
    if (props.vaccines) this._vaccines = props.vaccines;
  }

  get healthRecord(): HealthRecord | undefined {
    return this._healthRecord;
  }

  get veterinarian(): Veterinarian | undefined {
    return this._veterinarian;
  }

  get tags(): readonly MedicalCareTag[] {
    return this._tags;
  }

  get vaccines(): readonly MedicalCareVaccine[] {
    return this._vaccines;
  }

  addTag(tag: Tag) {
    if (this._tags.some((t) => t.tagId === tag.id)) return;

    this._tags.push(MedicalCareTag.create(this.id, tag));
  }

  removeTag(tagId: string) {
    const tag = this._tags.find((t) => t.tagId === tagId);
    if (!tag) return;

    tag.markAsDeleted();
  }

  addVaccine(vaccine: Vaccine) {
    if (this._vaccines.some((v) => v.vaccineId === vaccine.id)) return;

    this._vaccines.push(MedicalCareVaccine.create(this.id, vaccine));
  }

  removeVaccine(vaccineId: string) {
    const vaccine = this._vaccines.find((v) => v.vaccineId === vaccineId);
    if (!vaccine) return;

    vaccine.markAsDeleted();
  }
}