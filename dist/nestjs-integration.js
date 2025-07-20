"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNestJSConfiguration = void 0;
const validator_1 = require("./validator");
/**
 * Создает валидированную конфигурацию для NestJS с полной валидацией
 */
const createNestJSConfiguration = (rootSchema) => {
    const validator = new validator_1.AdvancedConfigValidator();
    // Валидируем всю схему
    const validationResult = validator.validateRootSchema(rootSchema);
    if (!validationResult.valid) {
        console.error('Configuration validation failed:');
        validationResult.errors.forEach((error) => console.error(`- ${error}`));
        throw new Error(`Configuration validation failed: ${validationResult.errors.join(', ')}`);
    }
    const config = {};
    // Получаем валидированную конфигурацию для каждой схемы
    for (const schema of rootSchema.properties) {
        try {
            config[schema.name] = validator.getValidatedConfig(schema, schema.name);
        }
        catch (error) {
            console.error(`Failed to validate ${schema.name} configuration:`, error);
            throw error;
        }
    }
    return config;
};
exports.createNestJSConfiguration = createNestJSConfiguration;
