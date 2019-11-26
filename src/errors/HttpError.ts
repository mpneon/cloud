export default abstract class HttpError extends Error {

    readonly abstract code: number;

    constructor(message?: string) {
        super(message);
    }
}
