import { AuditedBaseEntity } from "../../../core/bases/BaseModel";
import { MedicalCare } from "./MedicalCare.model";

export class HealthRecord extends AuditedBaseEntity {
  readonly animalId: string;
  readonly description: string;
  readonly recordDate: Date;

  private _medicalCares: MedicalCare[] = [];

  constructor(props: {
    id: string;
    animalId: string;
    description: string;
    recordDate: Date;
    createdAt: Date;
    updatedAt?: Date;
    isDeleted: boolean;
    medicalCares?: MedicalCare[];
  }) {
    super(props.id, props.createdAt, props.updatedAt, props.isDeleted);

    this.animalId = props.animalId;
    this.description = props.description;
    this.recordDate = props.recordDate;

    if (props.medicalCares) {
      this._medicalCares = props.medicalCares;
    }
  }

  get medicalCares(): readonly MedicalCare[] {
    return this._medicalCares;
  }
}