export type RoleName = "USER" | "ADMIN";

export interface RoleProps {
    id: string;
    name: RoleName;
    createdAt: Date;
    updatedAt?: Date;
    isDeleted: boolean;
}

export class Role {
    public readonly id: string;
    public readonly name: RoleName;
    public readonly createdAt: Date;
    public readonly updatedAt?: Date;
    public readonly isDeleted: boolean;

    constructor(props: {
        id: string;
        name: RoleName;
        createdAt: Date;
        updatedAt?: Date;
        isDeleted: boolean;
    }) {
        this.id = props.id;
        this.name = props.name;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
        this.isDeleted = props.isDeleted;
    }
}
