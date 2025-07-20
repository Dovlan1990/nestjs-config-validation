# GitHub Publishing Guide

## 🚀 How to Publish to GitHub

### Step 1: Create GitHub Repository

1. Go to GitHub and create a new repository
2. Name it `nestjs-config-validation`
3. Make it public
4. Don't initialize with README (we already have one)

### Step 2: Update Repository URLs

Update the URLs in `package.json`:

```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/Dovlan1990/nestjs-config-validation.git"
  },
  "bugs": {
    "url": "https://github.com/Dovlan1990/nestjs-config-validation/issues"
  },
  "homepage": "https://github.com/Dovlan1990/nestjs-config-validation#readme"
}
```

### Step 3: Initialize Git and Push

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: NestJS Configuration Validator"

# Add remote origin
git remote add origin https://github.com/Dovlan1990/nestjs-config-validation.git

# Push to GitHub
git push -u origin main
```

### Step 4: Create Release

1. Go to your GitHub repository
2. Click "Releases" on the right side
3. Click "Create a new release"
4. Tag version: `v1.0.0`
5. Release title: `v1.0.0 - Initial Release`
6. Description:
   ```
   ## 🎉 Initial Release
   
   - ✅ Type-safe configuration validation
   - ✅ Comprehensive validation for all data types
   - ✅ NestJS integration ready
   - ✅ Detailed error messages
   - ✅ Default value support
   - ✅ Enum validation with examples
   
   ## Installation
   
   ```bash
   npm install git+https://github.com/Dovlan1990/nestjs-config-validation.git
   ```
   ```

## 📦 Using the Package

### In Other Projects

Add to `package.json`:
```json
{
  "dependencies": {
    "nestjs-config-validator": "git+https://github.com/Dovlan1990/nestjs-config-validation.git"
  }
}
```

### Installation
```bash
npm install
```

### Usage
```typescript
import { 
  AdvancedConfigValidator, 
  RootConfigSchema, 
  createNestJSConfiguration 
} from 'nestjs-config-validator';

// Define your schema
const configSchema: RootConfigSchema = {
  description: 'My App Config',
  properties: [
    // ... your schema properties
  ]
};

// Use with NestJS
const config = createNestJSConfiguration(configSchema);
```

## 🔄 Updating the Package

### For Bug Fixes
1. Make your changes
2. Update version in `package.json`
3. Commit and push
4. Create new release with incremented patch version

### For New Features
1. Make your changes
2. Update version in `package.json` (minor version bump)
3. Update README.md if needed
4. Commit and push
5. Create new release

### For Breaking Changes
1. Make your changes
2. Update version in `package.json` (major version bump)
3. Update migration guide if needed
4. Commit and push
5. Create new release with migration notes

## 🎯 Best Practices

1. **Versioning**: Use semantic versioning (MAJOR.MINOR.PATCH)
2. **Documentation**: Keep README.md updated
3. **Examples**: Maintain working examples
4. **Testing**: Test before releasing
5. **Changelog**: Document changes in releases

## 🔧 Troubleshooting

### Package Not Found
- Check the GitHub URL is correct
- Ensure the repository is public
- Verify the package.json has correct name

### Import Errors
- Check TypeScript compilation works
- Verify all exports are correct
- Test with a simple import first

### Build Issues
- Run `npm run build` to check compilation
- Verify all dependencies are installed
- Check TypeScript configuration 