import { AuditedBaseEntity } from "../../../core/bases/BaseModel";

export class Veterinarian extends AuditedBaseEntity {
  private _firstName!: string;
  private _lastName!: string;
  private _email!: string;
  private _phone!: number;
  private _licenseNumber!: string;

  constructor(props: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: number;
    licenseNumber: string;
    createdAt: Date;
    updatedAt?: Date;
    isDeleted: boolean;
  }) {
    super(props.id, props.createdAt, props.updatedAt, props.isDeleted);

    this.setFirstName(props.firstName);
    this.setLastName(props.lastName);
    this.setEmail(props.email);
    this.setPhone(props.phone);
    this.setLicenseNumber(props.licenseNumber);
  }

  get firstName(): string {
    return this._firstName;
  }

  get lastName(): string {
    return this._lastName;
  }

  get email(): string {
    return this._email;
  }

  get phone(): number {
    return this._phone;
  }

  get licenseNumber(): string {
    return this._licenseNumber;
  }

  setFirstName(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new Error("First name is required");
    }
    this._firstName = value.trim();
  }

  setLastName(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new Error("Last name is required");
    }
    this._lastName = value.trim();
  }

  setEmail(value: string): void {
    if (!value || !/\S+@\S+\.\S+/.test(value)) {
      throw new Error("Email is invalid");
    }
    this._email = value.trim();
  }

  setPhone(value: number): void {
    this._phone = value;
  }

  setLicenseNumber(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new Error("License number is required");
    }
    this._licenseNumber = value.trim();
  }

  update(props: { firstName?: string; lastName?: string; email?: string; phone?: number; licenseNumber?: string }) {
    if (props.firstName !== undefined) this.setFirstName(props.firstName);
    if (props.lastName !== undefined) this.setLastName(props.lastName);
    if (props.email !== undefined) this.setEmail(props.email);
    if (props.phone !== undefined) this.setPhone(props.phone);
    if (props.licenseNumber !== undefined) this.setLicenseNumber(props.licenseNumber);
  }
}
