import { AuditedBaseEntity } from "../../../core/bases/BaseModel";
import { Veterinarian } from "../../../core/models/veterinarian.model";
import { HealthRecord } from "./HealthRecord.model";
import { MedicalCareTag } from "./MedicalCareTag";
import { MedicalCareVaccine } from "./MedicalCareVaccine.model";
import { Tag } from "./Tag.model";
import { Vaccine } from "./Vaccine.model";

export class MedicalCare extends AuditedBaseEntity {
  private _healthRecordId!: string;
  private _veterinarianId!: string;
  private _type!: string;
  private _description!: string;
  private _careDate!: Date;

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

    this.setHealthRecordId(props.healthRecordId);
    this.setVeterinarianId(props.veterinarianId);
    this.setType(props.type);
    this.setDescription(props.description);
    this.setCareDate(props.careDate);

    this._healthRecord = props.healthRecord;
    this._veterinarian = props.veterinarian;

    if (props.tags) this._tags = [...props.tags];
    if (props.vaccines) this._vaccines = [...props.vaccines];
  }

  get healthRecordId(): string {
    return this._healthRecordId;
  }

  get veterinarianId(): string {
    return this._veterinarianId;
  }

  get type(): string {
    return this._type;
  }

  get description(): string {
    return this._description;
  }

  get careDate(): Date {
    return this._careDate;
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

  setHealthRecordId(id: string): void {
    if (!id) throw new Error("HealthRecordId is required");
    this._healthRecordId = id;
  }

  setVeterinarianId(id: string): void {
    if (!id) throw new Error("VeterinarianId is required");
    this._veterinarianId = id;
  }

  setType(type: string): void {
    if (!type) throw new Error("MedicalCare type is required");
    this._type = type;
  }

  setDescription(description: string): void {
    this._description = description ?? "";
  }

  setCareDate(date: Date): void {
    if (!(date instanceof Date)) {
      throw new Error("CareDate must be a valid date");
    }
    this._careDate = date;
  }

  addTag(tag: Tag): void {
    if (this._tags.some((t) => t.tagId === tag.id)) return;
    this._tags.push(MedicalCareTag.create(this.id, tag));
  }

  removeTag(tagId: string): void {
    const tag = this._tags.find((t) => t.tagId === tagId);
    if (!tag) return;
    tag.markAsDeleted();
  }

  addVaccine(vaccine: Vaccine): void {
    if (this._vaccines.some((v) => v.vaccineId === vaccine.id)) return;
    this._vaccines.push(MedicalCareVaccine.create(this.id, vaccine));
  }

  removeVaccine(vaccineId: string): void {
    const vaccine = this._vaccines.find((v) => v.vaccineId === vaccineId);
    if (!vaccine) return;
    vaccine.markAsDeleted();
  }
}
