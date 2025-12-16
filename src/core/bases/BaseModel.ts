export abstract class BaseEntity {
  id: String;

  constructor(id: string) {
    this.id = id;
  }
}

export abstract class AuditedBaseEntity extends BaseEntity {
  createdAt: Date;
  updatedAt: Date;
  isDeleted: Boolean;

  constructor(id: string, createdAt: Date, updatedAt: Date, isdeleted: Boolean) {
    super(id);
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.isDeleted = isdeleted;
  }
}
