export abstract class BaseEntity {
  public readonly id: string;

  protected constructor(id: string) {
    this.id = id;
  }
}

export abstract class AuditedBaseEntity extends BaseEntity {
  public readonly createdAt: Date;
  protected updatedAt?: Date;
  protected isDeleted: boolean;

  protected constructor(id: string, createdAt: Date, updatedAt?: Date, isDeleted = false) {
    super(id);
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.isDeleted = isDeleted;
  }

  markAsDeleted(): void {
    if (this.isDeleted) return;
    this.isDeleted = true;
    this.touch();
  }

  protected touch(): void {
    this.updatedAt = new Date();
  }

  get deleted(): boolean {
    return this.isDeleted;
  }
}
