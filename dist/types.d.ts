/**
 * Базовые типы для схем конфигурации
 */
export type ConfigSchemaBaseType = {
    name: string;
    description?: string;
    required?: boolean;
};
/**
 * Схема для строковых значений
 */
export type StringConfigSchema = ConfigSchemaBaseType & {
    type: 'string';
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    examples?: string[];
} & ({
    required: true;
} | {
    required?: false;
    defaultValue?: string;
});
/**
 * Схема для числовых значений
 */
export type NumberConfigSchema = ConfigSchemaBaseType & {
    type: 'number';
    min?: number;
    max?: number;
    examples?: number[];
} & ({
    required: true;
} | {
    required?: false;
    defaultValue?: number;
});
/**
 * Схема для булевых значений
 */
export type BooleanConfigSchema = ConfigSchemaBaseType & {
    type: 'boolean';
    examples?: boolean[];
} & ({
    required: true;
} | {
    required?: false;
    defaultValue?: boolean;
});
/**
 * Схема для enum значений
 */
export type EnumConfigSchema = ConfigSchemaBaseType & {
    type: 'enum';
    enum: string[];
    examples?: string[];
} & ({
    required: true;
} | {
    required?: false;
    defaultValue?: string;
});
/**
 * Схема для объектных значений
 */
export type ObjectConfigSchema = ConfigSchemaBaseType & {
    type: 'object';
    properties: ConfigSchema[];
} & ({
    required: true;
} | {
    required?: false;
    defaultValue?: Record<string, any>;
});
/**
 * Объединенный тип для всех схем конфигурации
 */
export type ConfigSchema = StringConfigSchema | NumberConfigSchema | BooleanConfigSchema | EnumConfigSchema | ObjectConfigSchema;
/**
 * Корневая схема конфигурации
 */
export type RootConfigSchema = {
    description: string;
    properties: ConfigSchema[];
};
