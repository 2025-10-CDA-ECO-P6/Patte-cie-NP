import { AuditedBaseEntity } from "../../../core/bases/BaseModel";
import { Veterinarian } from "../../../core/models/veterinarian.model";
import { HealthRecord } from "./HealthRecord.model";
import { MedicalCareTag } from "./MedicalCareTag";
import { MedicalCareVaccine } from "./MedicalCareVaccine.model";

export class MedicalCare extends AuditedBaseEntity {
  readonly healthRecordId: string;
  readonly veterinarianId: string;
  readonly type: string;
  readonly description: string;
  readonly careDate: Date;

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
}