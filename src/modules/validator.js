const validator = require("validate.js");
const options   = {
    format       : "grouped",
    fullMessages : false,
};

validator.async.options = validator.options = options;

validator.validators.custom = async (value, params, attribute, object) => {
    if (typeof params.fun != 'function') {
        return 'invalid argument';
    }

    return params.fun(value, params, attribute, object);
};

validator.validators.custom_array = async (value, params, attribute) => {
    if (!validator.isObject(params.schema)) {
        return 'custom_array: invalid argument';
    }

    if (!value) {
        if (params.allow_empty) {
            return false;
        }

        return 'Поле не может быть пустым';
    }

    if (!validator.isArray(value)) {
        return 'Поле должно быть массивом';
    }

    let messages = [];

    for (const index in value) {
        const el = value[index];
        let res;

        if (validator.isObject(el)) {
            try {
                await validator.async(el, params.schema);
            } catch (error) {
                res = error;
            }

            if (res) {
                messages.push(...Object.keys(res).map(reason => res[reason].map(error => `${attribute}.${index}.${reason}: ${error}`).flat()));
            }
        } else {
            res = await validator.single(el, params.schema);

            if (res) {
                messages.push(...res.map(error => `${attribute}.${index}: ${error}`));
            }
        }
    }

    if (messages.length > 0) {
        return params.message || messages.join(' ')
    }

    return false;
};

validator.validators.custom_any = async (value, params) => {
    if (!validator.isArray(params.schemas)) {
        return 'custom_any: invalid argument';
    }

    if (!value) {
        if (params.allow_empty) {
            return false;
        }

        return 'Поле не может быть пустым';
    }

    for (const schema of params.schemas) {
        if (!validator.isObject(schema)) {
            return 'invalid argument';
        }

        let res;

        if (validator.isObject(value)) {
            try {
                await validator.async(value, schema);
            } catch (error) {
                res = error;
            }
        } else {
            res = await validator.single(value, schema);
        }

        if (res) {
            continue;
        }

        return false;
    }

    return params.message || 'Поле не соответсвует схеме';
};

validator.validators.sub_schema = async (value, params) => {
    if (!validator.isObject(params.schema)) {
        return 'sub_schema: invalid argument';
    }

    if (!value) {
        if (params.allow_empty) {
            return false;
        }

        return 'Поле не может быть пустым';
    }


    let res;

    if (validator.isObject(value)) {
        try {
            await validator.async(value, params.schema);
        } catch (error) {
            res = error;
        }
    } else {
        res = await validator.single(value, params.schema);
    }

    if (!res) {
        return false;
    }

    if (params.message) {
        return params.message;
    }

    return Object.keys(res).map(column => {
        return `${column}: ${res[column].join()};`
    }).join();
};

validator.validators.type.types.object = value => {
    return validator.isObject(value);
};

module.exports = validator;
