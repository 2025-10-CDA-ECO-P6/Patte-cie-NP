import { AuditedBaseEntity } from "../bases/BaseModel";

export class Owner extends AuditedBaseEntity {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly adresse: string;
  readonly phoneNumber: number;

  constructor(props: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    adresse: string;
    phoneNumber: number;
    createdAt: Date;
    updatedAt?: Date;
    isDeleted: boolean;
  }) {
    super(props.id, props.createdAt, props.updatedAt, props.isDeleted);
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.email = props.email;
    this.adresse = props.adresse;
    this.phoneNumber = props.phoneNumber;
  }
}