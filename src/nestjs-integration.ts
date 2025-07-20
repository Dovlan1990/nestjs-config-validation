import { RootConfigSchema } from './types';
import { AdvancedConfigValidator } from './validator';

/**
 * Создает валидированную конфигурацию для NestJS с полной валидацией
 */
export const createNestJSConfiguration = (rootSchema: RootConfigSchema) => {
  const validator = new AdvancedConfigValidator();
  
  // Валидируем всю схему
  const validationResult = validator.validateRootSchema(rootSchema);
  
  if (!validationResult.valid) {
    console.error('Configuration validation failed:');
    validationResult.errors.forEach((error) => console.error(`- ${error}`));
    throw new Error(`Configuration validation failed: ${validationResult.errors.join(', ')}`);
  }

  const config: any = {};

  // Получаем валидированную конфигурацию для каждой схемы
  for (const schema of rootSchema.properties) {
    try {
      config[schema.name] = validator.getValidatedConfig(schema, schema.name);
    } catch (error) {
      console.error(`Failed to validate ${schema.name} configuration:`, error);
      throw error;
    }
  }

  return config;
}; 