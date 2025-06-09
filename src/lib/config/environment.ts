/**
 * Environment Configuration
 * Centralized environment variable management with validation
 */

interface EnvironmentConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  JWT_SECRET: string;
  NEXTAUTH_SECRET: string;
  DATABASE_URL?: string;
  ADMIN_EMAIL: string;
  ADMIN_PASSWORD_HASH: string;
  USER_EMAIL: string;
  USER_PASSWORD_HASH: string;
  CLERK_SECRET_KEY?: string;
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?: string;
  GOOGLE_MY_BUSINESS_API_KEY?: string;
  GOOGLE_BUSINESS_ID?: string;
  GOOGLE_SERVICE_ACCOUNT_KEY?: string;
  MIGRATION_SECRET: string;
  NEXT_PUBLIC_SITE_URL: string;
  NEXT_PUBLIC_API_URL: string;
}

class EnvironmentValidator {
  private static instance: EnvironmentValidator;
  private config: EnvironmentConfig;

  private constructor() {
    this.config = this.validateAndLoadConfig();
  }

  public static getInstance(): EnvironmentValidator {
    if (!EnvironmentValidator.instance) {
      EnvironmentValidator.instance = new EnvironmentValidator();
    }
    return EnvironmentValidator.instance;
  }

  private validateAndLoadConfig(): EnvironmentConfig {
    const requiredVars = {
      NODE_ENV: process.env.NODE_ENV || 'development',
      JWT_SECRET: process.env.JWT_SECRET,
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
      ADMIN_EMAIL: process.env.ADMIN_EMAIL,
      ADMIN_PASSWORD_HASH: process.env.ADMIN_PASSWORD_HASH,
      USER_EMAIL: process.env.USER_EMAIL,
      USER_PASSWORD_HASH: process.env.USER_PASSWORD_HASH,
      MIGRATION_SECRET: process.env.MIGRATION_SECRET,
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
    };

    // Validate required environment variables
    const missing: string[] = [];
    
    if (!requiredVars.JWT_SECRET) missing.push('JWT_SECRET');
    if (!requiredVars.NEXTAUTH_SECRET) missing.push('NEXTAUTH_SECRET');
    if (!requiredVars.ADMIN_EMAIL) missing.push('ADMIN_EMAIL');
    if (!requiredVars.ADMIN_PASSWORD_HASH) missing.push('ADMIN_PASSWORD_HASH');
    if (!requiredVars.USER_EMAIL) missing.push('USER_EMAIL');
    if (!requiredVars.USER_PASSWORD_HASH) missing.push('USER_PASSWORD_HASH');
    if (!requiredVars.MIGRATION_SECRET) missing.push('MIGRATION_SECRET');

    if (missing.length > 0 && process.env.NODE_ENV === 'production') {
      throw new Error(
        `Missing required environment variables in production: ${missing.join(', ')}\n` +
        'Please set these variables in your production environment.'
      );
    }

    if (missing.length > 0 && process.env.NODE_ENV === 'development') {
      console.warn(
        `⚠️  Missing environment variables in development: ${missing.join(', ')}\n` +
        'Using fallback values. Set these in .env.local for production-like testing.'
      );
    }

    return {
      ...requiredVars,
      DATABASE_URL: process.env.DATABASE_URL,
      CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
      GOOGLE_MY_BUSINESS_API_KEY: process.env.GOOGLE_MY_BUSINESS_API_KEY,
      GOOGLE_BUSINESS_ID: process.env.GOOGLE_BUSINESS_ID,
      GOOGLE_SERVICE_ACCOUNT_KEY: process.env.GOOGLE_SERVICE_ACCOUNT_KEY
    } as EnvironmentConfig;
  }

  public getConfig(): EnvironmentConfig {
    return { ...this.config }; // Return a copy to prevent mutations
  }

  public get(key: keyof EnvironmentConfig): string | undefined {
    return this.config[key] as string | undefined;
  }

  public isProduction(): boolean {
    return this.config.NODE_ENV === 'production';
  }

  public isDevelopment(): boolean {
    return this.config.NODE_ENV === 'development';
  }

  public isTest(): boolean {
    return this.config.NODE_ENV === 'test';
  }
}

// Export singleton instance
export const env = EnvironmentValidator.getInstance();
export default env;

// Export types for TypeScript
export type { EnvironmentConfig };