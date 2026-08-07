export class HttpError<T extends Record<string, any>> extends Error {
    readonly status: number;
    readonly data?: T;

    constructor(
        status: number,
        message: string,
        data?: T,
        options?: ErrorOptions,
    ) {
        super(message, options);

        this.status = status;
        this.data = data;

        this.name = "HttpError";
        Error.captureStackTrace?.(this, HttpError);
    }

    toJSON = () => ({
        message: this.message,
        data: JSON.stringify(this.data)
    });
}