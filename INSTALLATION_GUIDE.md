# Installation Guide

## 🚀 How to Install

### Option 1: Direct Git Installation

```bash
npm install git+https://github.com/your-username/nest-config-validator.git
```

### Option 2: Add to package.json

```json
{
  "dependencies": {
    "nest-config-validator": "git+https://github.com/your-username/nest-config-validator.git"
  }
}
```

Then run:
```bash
npm install
```

## 🔄 Migration from BizdoBackend

### Step 1: Remove old files

Remove these files from your BizdoBackend project:
- `src/config/schemas/advanced-validator.ts`
- `src/config/schemas/types.ts` (if not used elsewhere)

### Step 2: Update imports

Replace imports in your files:

**Before:**
```typescript
import { AdvancedConfigValidator } from './advanced-validator';
import { RootConfigSchema } from './types';
import { createNestJSConfiguration } from './nestjs.integration';
```

**After:**
```typescript
import { 
  AdvancedConfigValidator, 
  RootConfigSchema, 
  createNestJSConfiguration 
} from 'nest-config-validator';
```

### Step 3: Update nestjs.integration.ts

Replace the content of `src/config/schemas/nestjs.integration.ts`:

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { configSchema } from './config';
import { createNestJSConfiguration } from 'nest-config-validator';

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

## ✅ Verification

After installation, verify that everything works:

```bash
# Test the import
npx ts-node -e "import { AdvancedConfigValidator } from 'nest-config-validator'; console.log('✅ Package imported successfully');"

# Test with your config schema
npx ts-node -e "import { createNestJSConfiguration } from 'nest-config-validator'; import { configSchema } from './src/config/schemas/config'; try { const config = createNestJSConfiguration(configSchema); console.log('✅ Configuration validation works!'); } catch (error) { console.log('❌ Error:', error.message); }"
```

## 🎯 Benefits of Migration

1. **Reusability** - Use in other projects
2. **Maintainability** - Centralized validation logic
3. **Versioning** - Easy to update across projects
4. **Community** - Share with other developers
5. **Documentation** - Comprehensive docs and examples

## 🔧 Troubleshooting

### TypeScript Errors
If you get TypeScript errors, make sure:
1. The package is properly installed
2. Your `tsconfig.json` includes `node_modules` in module resolution
3. You're using the correct import syntax

### Validation Errors
If validation fails:
1. Check your `config.json` file exists
2. Verify your schema matches the configuration structure
3. Look at the detailed error messages for guidance

### Build Issues
If build fails:
1. Run `npm run build` in the package directory
2. Check that all dependencies are installed
3. Verify TypeScript compilation works 