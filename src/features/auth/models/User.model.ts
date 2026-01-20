interface UserProps {
    id: string;
    email: string;
    password: string;
    roleId: string;
    createdAt: Date;
    updatedAt?: Date;
    isDeleted: boolean;
}

export class User {
    public readonly id: string;
    public email: string;
    public password: string;
    public roleId: string;
    public readonly createdAt: Date;
    public updatedAt?: Date;
    public isDeleted: boolean;

    constructor(props: UserProps) {
        this.id = props.id;
        this.email = props.email;
        this.password = props.password;
        this.roleId = props.roleId;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
        this.isDeleted = props.isDeleted;
    }

    get deleted(): boolean {
        return this.isDeleted;
    }
}
