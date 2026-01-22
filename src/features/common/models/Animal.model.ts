import { AuditedBaseEntity } from "../../../core/bases/BaseModel";
import { AnimalOwner } from "./AnimalOwner.model";
import { Owner } from "./Owner.model";
import { Species } from "./Species.model";
import { Weight } from "./value-object/Weight";

export class Animal extends AuditedBaseEntity {
  private _speciesId!: string;
  private _name!: string;
  private _birthDate!: Date;
  private _weight?: Weight;
  private _identification?: number;
  private _photoUrl?: string;
  private _species?: Species;
  private _owners: AnimalOwner[] = [];

  constructor(props: {
    id: string;
    speciesId: string;
    name: string;
    birthDate: Date;
    weight?: Weight;
    identification?: number;
    photoUrl?: string;
    species?: Species;
    owners?: AnimalOwner[];
    createdAt: Date;
    updatedAt?: Date;
    isDeleted: boolean;
  }) {
    super(props.id, props.createdAt, props.updatedAt, props.isDeleted);

    this.setName(props.name);
    this.setBirthDate(props.birthDate);
    this.setIdentification(props.identification);
    this.setPhotoUrl(props.photoUrl);
    this.setSpeciesId(props.speciesId);

    if (props.species) this._species = props.species;
    if (props.owners) this._owners = props.owners;
    if (props.weight) this.setWeight(props.weight);
  }

  get name(): string {
    return this._name;
  }

  get birthDate(): Date {
    return this._birthDate;
  }

  get identification(): number | undefined {
    return this._identification;
  }

  get photoUrl(): string | undefined {
    return this._photoUrl;
  }

  get species(): Species | undefined {
    return this._species;
  }

  get speciesId(): string {
    return this._speciesId;
  }

  get weight(): Weight | undefined {
    return this._weight;
  }

  get owners(): readonly AnimalOwner[] {
    return this._owners;
  }

  get owner(): Owner[] {
    return this._owners.filter((ao) => ao.owner && !ao.deleted).map((ao) => ao.owner!);
  }

  setName(name: string) {
    if (!name.trim()) throw new Error("Animal name is required");
    this._name = name.trim();
  }

  setBirthDate(date: Date) {
    if (!date) throw new Error("Birth date is required");
    this._birthDate = date;
  }

  setIdentification(id?: number) {
    if (id !== undefined && id <= 0) throw new Error("Identification must be > 0");
    this._identification = id;
  }

  setPhotoUrl(url?: string) {
    this._photoUrl = url?.trim();
  }

  setWeight(weight?: Weight) {
    this._weight = weight;
  }

  setSpeciesId(speciesId: string) {
    if (!speciesId.trim()) throw new Error("speciesId is required");
    this._speciesId = speciesId;
  }

  addOwner(owner: AnimalOwner) {
    if (!this._owners.some((o) => o.id === owner.id)) this._owners.push(owner);
  }

  update(props: {
    name?: string;
    birthDate?: Date;
    weight?: Weight;
    identification?: number;
    photoUrl?: string;
    speciesId?: string;
  }) {
    if (props.name !== undefined) this.setName(props.name);
    if (props.birthDate !== undefined) this.setBirthDate(props.birthDate);
    if (props.weight !== undefined) this.setWeight(props.weight);
    if (props.identification !== undefined) this.setIdentification(props.identification);
    if (props.photoUrl !== undefined) this.setPhotoUrl(props.photoUrl);
    if (props.speciesId !== undefined) this.setSpeciesId(props.speciesId);
  }
}
