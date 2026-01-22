import { randomUUID } from "node:crypto";
import { AuditedBaseEntity } from "../../../core/bases/BaseModel";
import { Animal } from "./Animal.model";
import { Owner } from "./Owner.model";

export class AnimalOwner extends AuditedBaseEntity {
  private _animalId!: string;
  private _ownerId!: string;
  private _startDate!: Date;
  private _endDate?: Date;

  private _animal?: Animal;
  private _owner?: Owner;

  constructor(props: {
    id: string;
    animalId: string;
    ownerId: string;
    startDate: Date;
    endDate?: Date;
    createdAt: Date;
    updatedAt?: Date;
    isDeleted: boolean;
    animal?: Animal;
    owner?: Owner;
  }) {
    super(props.id, props.createdAt, props.updatedAt, props.isDeleted);

    this.setAnimalId(props.animalId);
    this.setOwnerId(props.ownerId);
    this.setStartDate(props.startDate);
    this.setEndDate(props.endDate);

    this._animal = props.animal;
    this._owner = props.owner;
  }

  // Getters
  get animalId(): string {
    return this._animalId;
  }

  get ownerId(): string {
    return this._ownerId;
  }

  get startDate(): Date {
    return this._startDate;
  }

  get endDate(): Date | undefined {
    return this._endDate;
  }

  get animal(): Animal | undefined {
    return this._animal;
  }

  get owner(): Owner | undefined {
    return this._owner;
  }

  setAnimalId(id: string): void {
    if (!id) throw new Error("animalId is required");
    this._animalId = id;
  }

  setOwnerId(id: string): void {
    if (!id) throw new Error("ownerId is required");
    this._ownerId = id;
  }

  setStartDate(date: Date): void {
    if (!(date instanceof Date)) throw new Error("startDate must be a valid Date");
    this._startDate = date;
  }

  setEndDate(date?: Date): void {
    if (date && !(date instanceof Date)) throw new Error("endDate must be a valid Date");
    this._endDate = date;
  }

  static create(animalId: string, ownerId: string, animal?: Animal, owner?: Owner): AnimalOwner {
    return new AnimalOwner({
      id: randomUUID(),
      animalId,
      ownerId,
      startDate: new Date(),
      createdAt: new Date(),
      isDeleted: false,
      animal,
      owner,
    });
  }

  close(endDate: Date = new Date()): void {
    this.setEndDate(endDate);
  }
}