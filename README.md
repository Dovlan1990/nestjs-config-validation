# NestJS Config Validator

Advanced configuration validator for NestJS with type-safe schema validation.

## 🚀 Features

- ✅ **Type-safe validation** - Full TypeScript support with discriminated unions
- ✅ **Comprehensive validation** - String, number, boolean, object, and enum validation
- ✅ **Required field validation** - Check for missing required properties
- ✅ **Default value support** - Automatic application of default values
- ✅ **Enum validation** - Validate enum values, default values, and examples
- ✅ **NestJS integration** - Ready-to-use with NestJS ConfigModule
- ✅ **Detailed error messages** - Clear validation error reporting

## 📦 Installation

### From npm (Recommended)
```bash
npm install nestjs-config-validator
```

Or add to your `package.json`:

```json
{
  "dependencies": {
    "nestjs-config-validator": "^1.0.0"
  }
}
```

## 🎯 Quick Start

### 1. Define your configuration schema

```typescript
import { RootConfigSchema } from 'nestjs-config-validator';

export const configSchema: RootConfigSchema = {
  description: 'Application Configuration',
  properties: [
    {
      name: 'database',
      type: 'object',
      properties: [
        {
          name: 'host',
          type: 'string',
          required: true,
          description: 'Database host'
        },
        {
          name: 'port',
          type: 'number',
          defaultValue: 5432,
          min: 1,
          max: 65535
        },
        {
          name: 'ssl',
          type: 'enum',
          enum: ['disable', 'require', 'verify-ca', 'verify-full'],
          defaultValue: 'disable'
        }
      ]
    },
    {
      name: 'redis',
      type: 'object',
      properties: [
        {
          name: 'host',
          type: 'string',
          required: true
        },
        {
          name: 'port',
          type: 'number',
          defaultValue: 6379
        }
      ]
    }
  ]
};
```

### 2. Create your configuration file

```json
{
  "database": {
    "host": "localhost",
    "port": 5432,
    "ssl": "disable"
  },
  "redis": {
    "host": "localhost",
    "port": 6379
  }
}
```

### 3. Integrate with NestJS

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { createNestJSConfiguration } from 'nestjs-config-validator';
import { configSchema } from './config.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => createNestJSConfiguration(configSchema)],
      cache: true,
    }),
  ],
  exports: [ConfigModule],
})
export class AppConfigModule {}
```

## 🔧 Advanced Usage

### Using the validator directly

```typescript
import { AdvancedConfigValidator } from 'nestjs-config-validator';

const validator = new AdvancedConfigValidator('./config.json');
const result = validator.validateRootSchema(configSchema);

if (!result.valid) {
  console.error('Validation errors:', result.errors);
}
```

### Validating individual schemas

```typescript
import { AdvancedConfigValidator } from 'nestjs-config-validator';

const validator = new AdvancedConfigValidator();
const result = validator.validateSchema(databaseSchema, 'database');

if (!result.valid) {
  console.error('Database validation errors:', result.errors);
}
```

### Getting validated configuration

```typescript
import { AdvancedConfigValidator } from 'nestjs-config-validator';

const validator = new AdvancedConfigValidator();
const config = validator.getValidatedConfig(databaseSchema, 'database');
// config contains validated data with applied default values
```

## 📋 Schema Types

### String Schema
```typescript
{
  name: 'apiKey',
  type: 'string',
  required: true,
  minLength: 32,
  maxLength: 64,
  pattern: '^[A-Za-z0-9]+$'
}
```

### Number Schema
```typescript
{
  name: 'port',
  type: 'number',
  defaultValue: 3000,
  min: 1,
  max: 65535
}
```

### Boolean Schema
```typescript
{
  name: 'debug',
  type: 'boolean',
  defaultValue: false
}
```

### Enum Schema
```typescript
{
  name: 'environment',
  type: 'enum',
  enum: ['development', 'staging', 'production'],
  defaultValue: 'development',
  examples: ['development', 'production']
}
```

### Object Schema
```typescript
{
  name: 'database',
  type: 'object',
  properties: [
    {
      name: 'host',
      type: 'string',
      required: true
    },
    {
      name: 'port',
      type: 'number',
      defaultValue: 5432
    }
  ]
}
```

## 🎯 Validation Examples

### Type Validation
```typescript
// ❌ Error: wrong type
{
  "database": {
    "port": "5432" // should be number
  }
}
// Error: Property 'database.port' must be a number, got string

// ✅ Correct
{
  "database": {
    "port": 5432
  }
}
```

### Enum Validation
```typescript
// ❌ Error: value not in enum
{
  "database": {
    "ssl": "invalid" // should be one of the enum values
  }
}
// Error: Property 'database.ssl' must be one of [disable, require, verify-ca, verify-full], got invalid

// ✅ Correct
{
  "database": {
    "ssl": "disable"
  }
}
```

### Required Field Validation
```typescript
// ❌ Error: missing required field
{
  "database": {
    "port": 5432
    // missing host (required: true)
  }
}
// Error: Required property 'database.host' is missing

// ✅ Correct
{
  "database": {
    "host": "localhost",
    "port": 5432
  }
}
```

## 🔗 NestJS Integration

The package provides seamless integration with NestJS:

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { createNestJSConfiguration } from 'nestjs-config-validator';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => createNestJSConfiguration(configSchema)],
      cache: true,
    }),
  ],
  exports: [ConfigModule],
})
export class AppConfigModule {}
```

## 🎯 Benefits

### 1. Type Safety
- Full TypeScript support
- Discriminated unions for strict typing
- IDE autocompletion

### 2. Comprehensive Validation
- All data type validation
- Enum value validation
- Required field checking

### 3. NestJS Ready
- Ready for ConfigModule integration
- Automatic validation on app startup
- Detailed error messages

### 4. Extensible
- Easy to add new validation types
- Support for custom validators
- Flexible error system

## 📝 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 