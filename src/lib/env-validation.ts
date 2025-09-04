/**
 * Environment Variable Validation for Production Deployment
 * 
 * This module validates that all required environment variables are properly
 * configured for production deployment of Papromakeovers.
 */

interface EnvVar {
  name: string;
  description: string;
  required: boolean;
  validation?: (value: string) => boolean;
  validationMessage?: string;
}

// Define all environment variables needed for production
const ENV_VARIABLES: EnvVar[] = [
  // Supabase Configuration
  {
    name: 'NEXT_PUBLIC_SUPABASE_URL',
    description: 'Supabase project URL',
    required: true,
    validation: (value) => value.startsWith('https://') && value.includes('.supabase.co'),
    validationMessage: 'Must be a valid Supabase URL (https://xxx.supabase.co)'
  },
  {
    name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    description: 'Supabase anonymous key',
    required: true,
    validation: (value) => value.length > 100, // JWT tokens are typically longer
    validationMessage: 'Must be a valid Supabase JWT token'
  },
  {
    name: 'SUPABASE_SERVICE_ROLE_KEY',
    description: 'Supabase service role key (server-side)',
    required: true,
    validation: (value) => value.length > 100,
    validationMessage: 'Must be a valid Supabase service role JWT token'
  },

  // Authentication & Security
  {
    name: 'JWT_SECRET',
    description: 'Secret key for JWT token signing',
    required: true,
    validation: (value) => value.length >= 32,
    validationMessage: 'Must be at least 32 characters long for security'
  },
  {
    name: 'ADMIN_PASSCODE',
    description: 'Admin access passcode',
    required: true,
    validation: (value) => value.length >= 8 && /[A-Z]/.test(value) && /[a-z]/.test(value) && /\d/.test(value) && /[!@#$%^&*(),.?":{}|<>]/.test(value),
    validationMessage: 'Must be at least 8 characters with uppercase, lowercase, number, and special character'
  },

  // Email Service
  {
    name: 'RESEND_API_KEY',
    description: 'Resend API key for email delivery',
    required: true,
    validation: (value) => value.startsWith('re_'),
    validationMessage: 'Must be a valid Resend API key (starts with re_)'
  },

  // Production Environment
  {
    name: 'NODE_ENV',
    description: 'Node.js environment',
    required: true,
    validation: (value) => ['development', 'production', 'test'].includes(value),
    validationMessage: 'Must be one of: development, production, test'
  },

  // Optional but recommended for production
  {
    name: 'SESSION_DURATION',
    description: 'Session duration in seconds',
    required: false,
    validation: (value) => !isNaN(parseInt(value)) && parseInt(value) > 0,
    validationMessage: 'Must be a positive number'
  },
  {
    name: 'REMEMBER_ME_DURATION', 
    description: 'Remember me duration in seconds',
    required: false,
    validation: (value) => !isNaN(parseInt(value)) && parseInt(value) > 0,
    validationMessage: 'Must be a positive number'
  },

  // Domain configuration for production
  {
    name: 'NEXT_PUBLIC_DOMAIN',
    description: 'Production domain name',
    required: false,
    validation: (value) => /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/.test(value),
    validationMessage: 'Must be a valid domain name'
  },
  {
    name: 'NEXT_PUBLIC_URL',
    description: 'Full production URL',
    required: false,
    validation: (value) => value.startsWith('https://'),
    validationMessage: 'Must be a valid HTTPS URL'
  }
];

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  missingRequired: string[];
  summary: {
    total: number;
    present: number;
    valid: number;
    required: number;
    requiredPresent: number;
  };
}

export function validateEnvironmentVariables(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const missingRequired: string[] = [];
  
  let present = 0;
  let valid = 0;
  let requiredPresent = 0;
  const requiredCount = ENV_VARIABLES.filter(env => env.required).length;

  console.log('🔍 Validating environment variables...');

  for (const envVar of ENV_VARIABLES) {
    const value = process.env[envVar.name];
    
    if (!value) {
      if (envVar.required) {
        missingRequired.push(envVar.name);
        errors.push(`❌ Missing required environment variable: ${envVar.name} (${envVar.description})`);
      } else {
        warnings.push(`⚠️  Optional environment variable not set: ${envVar.name} (${envVar.description})`);
      }
      continue;
    }

    present++;
    if (envVar.required) {
      requiredPresent++;
    }

    // Validate the value if validation function is provided
    if (envVar.validation && !envVar.validation(value)) {
      errors.push(`❌ Invalid value for ${envVar.name}: ${envVar.validationMessage || 'Invalid format'}`);
    } else {
      valid++;
      console.log(`✅ ${envVar.name}: Valid`);
    }
  }

  const isValid = errors.length === 0 && missingRequired.length === 0;

  const summary = {
    total: ENV_VARIABLES.length,
    present,
    valid,
    required: requiredCount,
    requiredPresent
  };

  return {
    isValid,
    errors,
    warnings,
    missingRequired,
    summary
  };
}

export function logValidationResults(result: ValidationResult): void {
  const { isValid, errors, warnings, missingRequired, summary } = result;

  console.log('\n📋 Environment Variable Validation Report');
  console.log('=' .repeat(50));
  
  console.log(`📊 Summary:`);
  console.log(`   Total variables: ${summary.total}`);
  console.log(`   Present: ${summary.present}/${summary.total} (${Math.round((summary.present / summary.total) * 100)}%)`);
  console.log(`   Valid: ${summary.valid}/${summary.present} (${summary.present > 0 ? Math.round((summary.valid / summary.present) * 100) : 0}%)`);
  console.log(`   Required present: ${summary.requiredPresent}/${summary.required} (${Math.round((summary.requiredPresent / summary.required) * 100)}%)`);

  if (errors.length > 0) {
    console.log('\n🚨 ERRORS:');
    errors.forEach(error => console.log(`   ${error}`));
  }

  if (warnings.length > 0) {
    console.log('\n⚠️  WARNINGS:');
    warnings.forEach(warning => console.log(`   ${warning}`));
  }

  if (isValid) {
    console.log('\n✅ All required environment variables are properly configured!');
    console.log('🚀 Application is ready for production deployment.');
  } else {
    console.log('\n❌ Environment validation failed!');
    console.log('🛠️  Please fix the errors above before deploying to production.');
    
    if (missingRequired.length > 0) {
      console.log('\n📝 Quick fix commands:');
      console.log('   Copy .env.example to .env.local and fill in the missing values:');
      console.log('   cp .env.example .env.local');
      console.log('\n   Missing required variables:');
      missingRequired.forEach(varName => {
        console.log(`   ${varName}=your_${varName.toLowerCase()}_here`);
      });
    }
  }

  console.log('=' .repeat(50));
}

// Auto-validate on import in development
if (process.env.NODE_ENV !== 'production') {
  const result = validateEnvironmentVariables();
  logValidationResults(result);
  
  // In development, just warn but don't crash
  if (!result.isValid) {
    console.log('\n⚠️  Development mode: Continuing with invalid environment variables...');
  }
}

const envValidation = {
  validate: validateEnvironmentVariables,
  logResults: logValidationResults,
  ENV_VARIABLES
};

export default envValidation;