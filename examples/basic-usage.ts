import { RootConfigSchema, AdvancedConfigValidator, createNestJSConfiguration } from '../src';

// Define your configuration schema
const configSchema: RootConfigSchema = {
  description: 'Example Application Configuration',
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
    },
    {
      name: 'app',
      type: 'object',
      properties: [
        {
          name: 'port',
          type: 'number',
          defaultValue: 3000
        },
        {
          name: 'debug',
          type: 'boolean',
          defaultValue: false
        }
      ]
    }
  ]
};

// Example configuration file (config.json)
const exampleConfig = {
  database: {
    host: 'localhost',
    port: 5432,
    ssl: 'disable'
  },
  redis: {
    host: 'localhost',
    port: 6379
  },
  app: {
    port: 3000,
    debug: true
  }
};

// Example 1: Direct validation
console.log('=== Example 1: Direct Validation ===');
const validator = new AdvancedConfigValidator();
const result = validator.validateRootSchema(configSchema);

if (result.valid) {
  console.log('✅ Configuration is valid!');
} else {
  console.log('❌ Configuration validation failed:');
  result.errors.forEach(error => console.log(`  - ${error}`));
}

// Example 2: Get validated configuration
console.log('\n=== Example 2: Get Validated Configuration ===');
try {
  const config = validator.getValidatedConfig(configSchema.properties[0], 'database');
  console.log('✅ Database config:', config);
} catch (error) {
  console.log('❌ Error:', error instanceof Error ? error.message : String(error));
}

// Example 3: NestJS integration
console.log('\n=== Example 3: NestJS Integration ===');
try {
  const nestConfig = createNestJSConfiguration(configSchema);
  console.log('✅ NestJS config created successfully');
  console.log('Config keys:', Object.keys(nestConfig));
} catch (error) {
  console.log('❌ NestJS integration error:', error instanceof Error ? error.message : String(error));
} 