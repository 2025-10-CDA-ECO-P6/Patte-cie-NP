import { AuditedBaseEntity } from "../../../core/bases/BaseModel";
import { MedicalCareTag } from "./MedicalCareTag";

export class Tag extends AuditedBaseEntity {
  readonly name: string;

  private _medicalCares: MedicalCareTag[] = [];

  constructor(props: {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt?: Date;
    isDeleted: boolean;
    medicalCares?: MedicalCareTag[];
  }) {
    super(props.id, props.createdAt, props.updatedAt, props.isDeleted);
    this.name = props.name;
    if (props.medicalCares) this._medicalCares = props.medicalCares;
  }

  get medicalCares(): readonly MedicalCareTag[] {
    return this._medicalCares;
  }
}