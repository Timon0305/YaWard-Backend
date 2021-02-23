class ErrorResponse extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

const StatusCode = {
    SUCCESS_CODE: 'SUCCESSFULLY ADDED',
    EMAIL_NOT_VERIFIED: 'EMAIL_NOT_VERIFIED',
    DUPLICATE_EMAIL: 'DUPLICATE_EMAIL',
    DUPLICATE_CATEGORY: 'DUPLICATE_CATEGORY',
    DUPLICATE_OCCASION: 'DUPLICATE_OCCASION',
    DUPLICATE_SLUG: 'DUPLICATE_SLUG',
    UNAUTHORIZED: 'UNAUTHORIZED',
    EMAIL_ERROR: 'Email Error',
    TOKEN_EXPIRE: 'TOKEN_EXPIRE',
    WRONG_PASSWORD: 'WRONG_PASSWORD',
    SERVER_ERROR: 'SERVER_ERROR',
    NOT_FOUND_ERR: 'NOT FOUND'
};

module.exports = ErrorResponse;
module.exports.StatusCode = StatusCode;