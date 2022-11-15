import { camelCase } from 'case-anything';
import { isFullString, isArray, isFullObject } from 'is-what';

export const toCamelCase = (value: any) => {
    if (isFullString(value)) return camelCase(value);
    else if (isArray(value)) {
        return value.map((item) => {
            isFullObject(item) ? objectToCamelCase(item) : camelCase(item);
        });
    } else if (isFullObject(value)) return objectToCamelCase(value);

    return value;
};

const objectToCamelCase = (object: Record<any, any>): Record<any, any> => {
    const result: Record<any, any> = {};

    for (const key in object) {
        result[toCamelCase(key)] = object[key];
    }

    return result;
};
