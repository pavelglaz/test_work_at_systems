class Response {
    constructor(status, data) {
        this.statusToCode = {
            [Response.STATUS_OK] : Response.CODE_OK,
            [Response.STATUS_BR] : Response.CODE_BR,
            [Response.STATUS_FB] : Response.CODE_FB,
            [Response.STATUS_NF] : Response.CODE_NF,
            [Response.STATUS_SE] : Response.CODE_SE,
        };

        this.statusToErrorDetails = {
            [Response.STATUS_BR] : 'BadRequestErrorDetails',
        };

        this.code   = this.statusToCode[status];
        this.status = status;
        this.data   = data;
    }

    static create(status, data) {
        return new this(status, data);
    }

    /**
     * Задать ошибку ответа
     *
     * @param {string} message - Сообщение ошибки (Пр.: "Ошибка валидации данных").
     * @param {object} details - Объект с детализацией ошибки (Пр.: { violations: [{
     *       "reason": "action_id",
     *       "message": "Поле должно быть типа integer"
     *    }]})
     * @param {string} type - Тип ошибки (Пр.: "BadRequestErrorDetails").
     * @returns {Response}
     */
    setError(message, details, type) {
        this.error = {message};

        if (details) {
            this.errorDetails(details, type);
        }

        return this;
    }

    errorDetails(value, type_url) {
        if (!type_url) {
            type_url = this.getErrorDetailsType();
        }

        if (type_url === 'BadRequestErrorDetails' && value.violations) {
            value.violations = Response.transformViolations(value.violations);
        }
        this.error.details = {type_url, value};
        return this;
    }

    static transformViolations(violations) {
        return violations.map(v => {
            let reason = (v.reason || v.field);

            reason = reason.split(/(?=[A-Z])/).join('_').toLowerCase().replace(/^_|\._/, '');

            return {reason : this.map_reasons(reason), message : v.message};
        });
    }

    getErrorDetailsType() {
        if (!this.status) {
            throw new Error('Unable to define error details type. Set "status" first');
        }
        const type = this.statusToErrorDetails[this.status];
        if (!type) {
            throw new Error(`No error details type specified for status=${this.status}`);
        }
        return type;
    }

    obj() {
        return {
            code   : this.code,
            status : this.status,
            error  : this.error,
            ...this.data,
        };
    }

    /**
     *
     * В некоторых сервисах для параметров используется camelCase, у нас snake_case.
     * Будем мапить такие ключи.
     *
     */
    static map_reasons(reason) {
        const dictionary = {
            'oldPassword' : 'old_password',
            'newPassword' : 'new_password',
        };
        return dictionary[reason] || reason;
    }
}

Response.CODE_OK = 200;
Response.CODE_BR = 400;
Response.CODE_FB = 403;
Response.CODE_NF = 404;
Response.CODE_SE = 500;

Response.STATUS_OK = 'OK';
Response.STATUS_BR = 'BAD_REQUEST';
Response.STATUS_FB = 'FORBIDDEN';
Response.STATUS_NF = 'NOT_FOUND';
Response.STATUS_SE = 'SERVER_ERROR';

Response.ERROR_MSG_SE  = 'Неизвестная техническая ошибка';
Response.ERROR_MSG_BR  = 'Ошибка валидации данных';

Response.TYPE_BAD_REQUEST = 'BadRequestErrorDetails';

module.exports = Response;
