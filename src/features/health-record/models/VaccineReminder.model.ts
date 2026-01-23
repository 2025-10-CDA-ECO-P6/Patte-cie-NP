import { AuditedBaseEntity } from "../../../core/bases/BaseModel";

export class VaccineReminder extends AuditedBaseEntity {
    private _vaccineId: string;
    private _remindAt: Date;
    private _isSent: boolean;

    constructor(props: {
        id: string;
        vaccineId: string;
        remindAt: Date;
        isSent: boolean;
        createdAt: Date;
        updatedAt?: Date;
        isDeleted: boolean;
    }) {
        super(props.id, props.createdAt, props.updatedAt, props.isDeleted);

        this._vaccineId = props.vaccineId;
        this._remindAt = props.remindAt;
        this._isSent = props.isSent;
    }

    get vaccineId() {
        return this._vaccineId;
    }

    get remindAt() {
        return this._remindAt;
    }

    get isSent() {
        return this._isSent;
    }
    // rappel envoyé
    markAsSent() {
        this._isSent = true;
        this.touch(); // méthode héritée, met à jour updatedAt
    }
    // mets à jour la date de rappel
    updateRemindAt(date: Date) {
        this._remindAt = date;
        this.touch();
    }
}
