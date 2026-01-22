import { AuditedBaseEntity } from "../../../core/bases/BaseModel";
import { Animal } from "./Animal.model";
import { AnimalOwner } from "./AnimalOwner.model";

export class Owner extends AuditedBaseEntity {
  private _firstName!: string;
  private _lastName!: string;
  private _email!: string;
  private _address!: string;
  private _phoneNumber!: number;
  private _animalOwners: AnimalOwner[] = [];

  constructor(props: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    phoneNumber: number;
    animalOwners?: AnimalOwner[];
    createdAt: Date;
    updatedAt?: Date;
    isDeleted: boolean;
  }) {
    super(props.id, props.createdAt, props.updatedAt, props.isDeleted);

    this.setFirstName(props.firstName);
    this.setLastName(props.lastName);
    this.setEmail(props.email);
    this.setAddress(props.address);
    this.setPhoneNumber(props.phoneNumber);

    if (props.animalOwners) this._animalOwners = props.animalOwners;
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

  get address(): string {
    return this._address;
  }

  get phoneNumber(): number {
    return this._phoneNumber;
  }

  get animalOwners(): readonly AnimalOwner[] {
    return this._animalOwners;
  }

  get animals(): Animal[] {
    return this._animalOwners.filter((ao) => ao.animal && !ao.deleted).map((ao) => ao.animal!);
  }

  setFirstName(value: string) {
    if (!value.trim()) throw new Error("First name is required");
    this._firstName = value.trim();
  }

  setLastName(value: string) {
    if (!value.trim()) throw new Error("Last name is required");
    this._lastName = value.trim();
  }

  setEmail(value: string) {
    if (!value.trim() || !/\S+@\S+\.\S+/.test(value)) throw new Error("Email is invalid");
    this._email = value.trim();
  }

  setAddress(value: string) {
    if (!value.trim()) throw new Error("Address is required");
    this._address = value.trim();
  }

  setPhoneNumber(value: number) {
    this._phoneNumber = value;
  }

  update(props: { firstName?: string; lastName?: string; email?: string; address?: string; phoneNumber?: number }) {
    if (props.firstName !== undefined) this.setFirstName(props.firstName);
    if (props.lastName !== undefined) this.setLastName(props.lastName);
    if (props.email !== undefined) this.setEmail(props.email);
    if (props.address !== undefined) this.setAddress(props.address);
    if (props.phoneNumber !== undefined) this.setPhoneNumber(props.phoneNumber);
  }

  addAnimalOwner(animalOwner: AnimalOwner) {
    if (!this._animalOwners.some((a) => a.id === animalOwner.id)) this._animalOwners.push(animalOwner);
  }

  removeAnimalOwner(animalId: string) {
    const relation = this._animalOwners.find((a) => a.animalId === animalId && !a.deleted);
    if (!relation) throw new Error(`No relation found for animalId ${animalId}`);
    relation.close(); // soft delete
    this._animalOwners = this._animalOwners.filter((a) => a.id !== relation.id);
  }
}