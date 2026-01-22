import { AuditedBaseEntity } from "../../../core/bases/BaseModel";
import { Animal } from "./Animal.model";

export class Species extends AuditedBaseEntity {
  private _name: string;
  private _description?: string;
  private readonly _animals: Animal[] = [];

  constructor(props: {
    id: string;
    name: string;
    description?: string;
    animals?: Animal[];
    createdAt: Date;
    updatedAt?: Date;
    isDeleted: boolean;
  }) {
    super(props.id, props.createdAt, props.updatedAt, props.isDeleted);

    this._name = props.name;
    this._description = props.description;
    if (props.animals) this._animals = props.animals;
  }

  get name(): string {
    return this._name;
  }

  get description(): string | undefined {
    return this._description;
  }

  get animals(): readonly Animal[] {
    return this._animals;
  }

  setName(name: string) {
    if (!name.trim()) throw new Error("Species name is required");
    this._name = name.trim();
  }

  setDescription(desc?: string) {
    this._description = desc?.trim();
  }

  update(props: { name?: string; description?: string }) {
    if (props.name !== undefined) this.setName(props.name);
    if (props.description !== undefined) this.setDescription(props.description);
  }
}
