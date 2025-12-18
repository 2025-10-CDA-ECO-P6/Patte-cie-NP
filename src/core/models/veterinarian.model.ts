import { AuditedBaseEntity } from "../bases/BaseModel";

export class Veterinarian extends AuditedBaseEntity {
    readonly firstName: string;
    readonly lastName: string;
    readonly email: string;
    readonly phone: string;
    readonly licenseNumber: string;

    constructor(props: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        licenseNumber: string;
        createdAt: Date;
        updatedAt?: Date;
        isDeleted: boolean;
    }) {
        super(props.id, props.createdAt, props.updatedAt, props.isDeleted);

        this.firstName = props.firstName;
        this.lastName = props.lastName;
        this.email = props.email;
        this.phone = props.phone;
        this.licenseNumber = props.licenseNumber;
    }
}
