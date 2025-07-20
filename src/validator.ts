import * as fs from 'fs';
import * as path from 'path';

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
export class AdvancedConfigValidator {
  private configData: ConfigValue = {};

  constructor(configPath?: string) {
    const configPathToUse = configPath || path.resolve(process.cwd(), 'config.json');
    this.loadConfig(configPathToUse);
  }

  private loadConfig(configPath: string): void {
    if (!fs.existsSync(configPath)) {
      console.warn(`Config file not found at ${configPath}`);
      this.configData = {};
      return;
    }

    try {
      const configContent = fs.readFileSync(configPath, 'utf-8');
      this.configData = JSON.parse(configContent);
    } catch (error) {
      console.warn(
        `Failed to parse config file: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      this.configData = {};
    }
  }

  /**
   * Валидирует схему конфигурации
   */
  validateSchema(schema: ConfigSchema, configSection?: string): ValidationResult {
    const errors: string[] = [];
    const config = configSection ? this.configData[configSection] : this.configData;

    if (!config) {
      if (schema.required) {
        errors.push(`Configuration section '${schema.name}' is missing`);
      }
      return { valid: errors.length === 0, errors };
    }

    // Валидируем только объекты с properties
    if (schema.type === 'object' && 'properties' in schema && schema.properties) {
      for (const property of schema.properties) {
        const value = config[property.name];
        const propertyPath = `${schema.name}.${property.name}`;

        // Проверка обязательности
        if (property.required && value === undefined) {
          errors.push(`Required property '${propertyPath}' is missing`);
          continue;
        }

        // Если значение не задано, используем значение по умолчанию
        if (value === undefined && 'defaultValue' in property && property.defaultValue !== undefined) {
          config[property.name] = property.defaultValue;
          continue;
        }

        // Если значение все еще не задано и не обязательное, пропускаем
        if (value === undefined) {
          continue;
        }

        // Валидация по типу
        const typeError = this.validatePropertyType(property, value, propertyPath);
        if (typeError) {
          errors.push(typeError);
        }

        // Дополнительная валидация для enum
        if (property.type === 'enum') {
          const enumError = this.validateEnumProperty(property, value, propertyPath);
          if (enumError) {
            errors.push(enumError);
          }
        }
      }
    }

    return { valid: errors.length === 0, errors };
  }

  /**
   * Валидирует тип свойства
   */
  private validatePropertyType(property: any, value: any, propertyPath: string): string | null {
    switch (property.type) {
      case 'string':
        if (typeof value !== 'string') {
          return `Property '${propertyPath}' must be a string, got ${typeof value}`;
        }
        if (property.minLength && value.length < property.minLength) {
          return `Property '${propertyPath}' must be at least ${property.minLength} characters long`;
        }
        if (property.maxLength && value.length > property.maxLength) {
          return `Property '${propertyPath}' must be at most ${property.maxLength} characters long`;
        }
        if (property.pattern && !new RegExp(property.pattern).test(value)) {
          return `Property '${propertyPath}' does not match pattern ${property.pattern}`;
        }
        break;

      case 'number':
        if (typeof value !== 'number') {
          return `Property '${propertyPath}' must be a number, got ${typeof value}`;
        }
        if (property.min !== undefined && value < property.min) {
          return `Property '${propertyPath}' must be >= ${property.min}, got ${value}`;
        }
        if (property.max !== undefined && value > property.max) {
          return `Property '${propertyPath}' must be <= ${property.max}, got ${value}`;
        }
        break;

      case 'boolean':
        if (typeof value !== 'boolean') {
          return `Property '${propertyPath}' must be a boolean, got ${typeof value}`;
        }
        break;

      case 'object':
        if (typeof value !== 'object' || value === null || Array.isArray(value)) {
          return `Property '${propertyPath}' must be an object, got ${typeof value}`;
        }
        if (property.properties) {
          for (const prop of property.properties) {
            const propValue = value[prop.name];
            if (prop.required && propValue === undefined) {
              return `Required property '${prop.name}' is missing in ${propertyPath}`;
            }
            if (propValue !== undefined) {
              const propError = this.validatePropertyType(
                prop,
                propValue,
                `${propertyPath}.${prop.name}`,
              );
              if (propError) {
                return propError;
              }
            }
          }
        }
        break;

      case 'enum':
        if (!property.enum.includes(value)) {
          return `Property '${propertyPath}' must be one of [${property.enum.join(', ')}], got ${value}`;
        }
        break;
    }

    return null;
  }

  /**
   * Дополнительная валидация для enum свойств
   */
  private validateEnumProperty(property: any, value: any, propertyPath: string): string | null {
    // Проверяем defaultValue
    if ('defaultValue' in property && property.defaultValue !== undefined && !property.enum.includes(property.defaultValue)) {
      return `Default value '${property.defaultValue}' for '${propertyPath}' is not in enum [${property.enum.join(', ')}]`;
    }

    // Проверяем examples
    if (property.examples) {
      for (const example of property.examples) {
        if (!property.enum.includes(example)) {
          return `Example value '${example}' for '${propertyPath}' is not in enum [${property.enum.join(', ')}]`;
        }
      }
    }

    return null;
  }

  /**
   * Получает валидированную конфигурацию
   */
  getValidatedConfig(schema: ConfigSchema, configSection?: string): ConfigValue {
    const result = this.validateSchema(schema, configSection);

    if (!result.valid) {
      throw new Error(
        `Configuration validation failed for ${schema.name}: ${result.errors.join(', ')}`,
      );
    }

    const config = configSection ? this.configData[configSection] : this.configData;
    const validatedConfig: ConfigValue = {};

    // Применяем значения по умолчанию и возвращаем валидированную конфигурацию
    if (schema.type === 'object' && 'properties' in schema && schema.properties) {
      for (const property of schema.properties) {
        const value = config?.[property.name];
        validatedConfig[property.name] = value !== undefined ? value : ('defaultValue' in property ? property.defaultValue : undefined);
      }
    }

    return validatedConfig;
  }

  /**
   * Валидирует всю корневую схему
   */
  validateRootSchema(rootSchema: RootConfigSchema): ValidationResult {
    const errors: string[] = [];

    for (const schema of rootSchema.properties) {
      const result = this.validateSchema(schema, schema.name);
      if (!result.valid) {
        errors.push(...result.errors);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
} 