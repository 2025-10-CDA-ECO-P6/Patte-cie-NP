import { AuditedBaseEntity } from "../bases/BaseModel";

export class Veterinarian extends AuditedBaseEntity {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    licenseNumber: string;


    constructor(id: string, firstName: string, lastName: string, email: string, phone: string, licenseNumber: string,
        createdAt: Date, updatedAt: Date, isDeleted: boolean) {
        super((id = id), (createdAt = createdAt), (updatedAt = updatedAt), (isDeleted = isDeleted));

        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.licenseNumber = licenseNumber;
    }
}