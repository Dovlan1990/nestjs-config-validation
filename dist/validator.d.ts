import { RootConfigSchema, ConfigSchema } from './types';
export interface ConfigValue {
    [key: string]: any;
}
export interface ValidationResult {
    valid: boolean;
    errors: string[];
}
/**
 * Продвинутый валидатор конфигурации с полной валидацией
 */
export declare class AdvancedConfigValidator {
    private configData;
    constructor(configPath?: string);
    private loadConfig;
    /**
     * Валидирует схему конфигурации
     */
    validateSchema(schema: ConfigSchema, configSection?: string): ValidationResult;
    /**
     * Валидирует тип свойства
     */
    private validatePropertyType;
    /**
     * Дополнительная валидация для enum свойств
     */
    private validateEnumProperty;
    /**
     * Получает валидированную конфигурацию
     */
    getValidatedConfig(schema: ConfigSchema, configSection?: string): ConfigValue;
    /**
     * Валидирует всю корневую схему
     */
    validateRootSchema(rootSchema: RootConfigSchema): ValidationResult;
}
