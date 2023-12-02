import { BaseError } from "./BaseError";

export class UnauthorizedError extends BaseError {
    constructor(
        message: string = "Acesso não autorizado"
    ) {
        super(401, message)
    }
}