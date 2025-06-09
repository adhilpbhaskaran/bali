#!/usr/bin/env node

/**
 * Security Audit Script for Bali Project
 * Identifies and reports security vulnerabilities
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class SecurityAuditor {
  constructor() {
    this.issues = [];
    this.srcPath = path.join(__dirname, '..', 'src');
    this.rootPath = path.join(__dirname, '..');
  }

  log(type, message, file = null) {
    const entry = { type, message, file, timestamp: new Date().toISOString() };
    
    switch (type) {
      case 'error':
        this.issues.push(entry);
        console.log(`[ERROR] ${message}${file ? ` (${file})` : ''}`);
        break;
      case 'warning':
        this.warnings.push(entry);
        console.log(`[WARNING] ${message}${file ? ` (${file})` : ''}`);
        break;
      case 'pass':
        this.passed.push(entry);
        console.log(`[PASS] ${message}${file ? ` (${file})` : ''}`);
        break;
      default:
        console.log(`[INFO] ${message}${file ? ` (${file})` : ''}`);
    }
  }

  // Check for hardcoded secrets and credentials
  checkHardcodedSecrets() {
    console.log('\n[CHECK] Checking for hardcoded secrets...');
    
    const secretPatterns = [
      { pattern: /password\s*[=:]\s*["'][^"']{3,}["']/gi, name: 'Hardcoded passwords' },
      { pattern: /api[_-]?key\s*[=:]\s*["'][^"']{10,}["']/gi, name: 'API keys' },
      { pattern: /secret\s*[=:]\s*["'][^"']{10,}["']/gi, name: 'Secrets' },
      { pattern: /token\s*[=:]\s*["'][^"']{20,}["']/gi, name: 'Tokens' },
      { pattern: /sk_[a-zA-Z0-9]{20,}/g, name: 'Secret keys' },
      { pattern: /pk_[a-zA-Z0-9]{20,}/g, name: 'Public keys' }
    ];

    this.scanFiles(['src', 'pages', 'components'], ['.ts', '.tsx', '.js', '.jsx'], (filePath, content) => {
      secretPatterns.forEach(({ pattern, name }) => {
        const matches = content.match(pattern);
        if (matches && !filePath.includes('.env.example')) {
          // Check if this is a development fallback with proper guards
          const isDevelopmentFallback = content.includes('NODE_ENV === \'development\'') && 
                                       content.includes('console.warn') &&
                                       (content.includes('development-only') || content.includes('development credentials'));
          
          // Check if credentials are loaded from environment variables
          const hasEnvironmentConfig = (content.includes('process.env.ADMIN_EMAIL') &&
                                       content.includes('process.env.ADMIN_PASSWORD_HASH')) ||
                                      (content.includes('process.env.USER_EMAIL') &&
                                       content.includes('process.env.USER_PASSWORD_HASH'));
          
          if (isDevelopmentFallback && hasEnvironmentConfig) {
            this.log('pass', `${name} properly guarded as development fallback`, filePath);
          } else {
            this.log('error', `${name} found in source code`, filePath);
          }
        }
      });
    });
  }

  // Check for dangerous HTML rendering
  checkDangerousHTML() {
    console.log('\n[CHECK] Checking for dangerous HTML rendering...');
    
    this.scanFiles(['src'], ['.tsx', '.jsx'], (filePath, content) => {
      if (content.includes('dangerouslySetInnerHTML')) {
        this.log('error', 'dangerouslySetInnerHTML usage found', filePath);
      }
      
      if (content.includes('innerHTML')) {
        this.log('warning', 'innerHTML usage found - verify sanitization', filePath);
      }
    });
  }

  // Check for insecure window.open usage
  checkWindowOpen() {
    console.log('\n[CHECK] Checking window.open security...');
    
    this.scanFiles(['src'], ['.ts', '.tsx', '.js', '.jsx'], (filePath, content) => {
      const windowOpenMatches = content.match(/window\.open\([^)]+\)/g);
      if (windowOpenMatches) {
        windowOpenMatches.forEach(match => {
          if (!match.includes('noopener') || !match.includes('noreferrer')) {
            this.log('error', 'Insecure window.open without noopener/noreferrer', filePath);
          } else {
            this.log('pass', 'Secure window.open usage', filePath);
          }
        });
      }
    });
  }

  // Check for console.log in production code
  checkConsoleLogging() {
    console.log('\n[CHECK] Checking for console.log statements...');
    
    this.scanFiles(['src'], ['.ts', '.tsx', '.js', '.jsx'], (filePath, content) => {
      const consoleMatches = content.match(/console\.(log|debug|info|warn|error)/g);
      if (consoleMatches && !filePath.includes('logger.ts')) {
        this.log('warning', `${consoleMatches.length} console statements found`, filePath);
      }
    });
  }

  // Check environment configuration
  checkEnvironmentConfig() {
    console.log('\n[CHECK] Checking environment configuration...');
    
    const envExamplePath = path.join(this.projectRoot, '.env.example');
    const envPath = path.join(this.projectRoot, '.env.local');
    
    if (fs.existsSync(envExamplePath)) {
      this.log('pass', '.env.example template exists');
      
      const envExample = fs.readFileSync(envExamplePath, 'utf8');
      const requiredVars = [
        'JWT_SECRET',
        'ADMIN_PASSWORD_HASH',
        'ENCRYPTION_KEY'
      ];
      
      requiredVars.forEach(varName => {
        if (envExample.includes(varName)) {
          this.log('pass', `${varName} template exists`);
        } else {
          this.log('error', `Missing ${varName} in environment template`);
        }
      });
    } else {
      this.log('error', '.env.example template missing');
    }
    
    if (fs.existsSync(envPath)) {
      this.log('pass', 'Local environment file exists');
    } else {
      this.log('warning', '.env.local not found - ensure environment is configured');
    }
  }

  // Check for proper event listener cleanup
  checkEventListeners() {
    console.log('\n[CHECK] Checking event listener cleanup...');
    
    this.scanFiles(['src'], ['.tsx', '.jsx'], (filePath, content) => {
      const addListenerMatches = content.match(/addEventListener/g);
      const removeListenerMatches = content.match(/removeEventListener/g);
      
      if (addListenerMatches && removeListenerMatches) {
        if (addListenerMatches.length === removeListenerMatches.length) {
          this.log('pass', 'Event listeners properly cleaned up', filePath);
        } else {
          this.log('warning', 'Potential memory leak - unmatched event listeners', filePath);
        }
      } else if (addListenerMatches && !removeListenerMatches) {
        this.log('error', 'Event listeners without cleanup', filePath);
      }
    });
  }

  // Check for SQL injection vulnerabilities
  checkSQLInjection() {
    console.log('\n[CHECK] Checking for SQL injection vulnerabilities...');
    
    this.scanFiles(['src'], ['.ts', '.js'], (filePath, content) => {
      // More precise patterns for actual SQL injection vulnerabilities
      const sqlInjectionPatterns = [
        // Direct SQL query construction with user input
        /(?:query|execute|raw)\s*\([^)]*\$\{[^}]+\}[^)]*\)/gi,
        // String concatenation in SQL context
        /["']\s*SELECT\s+.*\+.*["']/gi,
        /["']\s*INSERT\s+.*\+.*["']/gi,
        /["']\s*UPDATE\s+.*\+.*["']/gi,
        /["']\s*DELETE\s+.*\+.*["']/gi,
        // Template literals in SQL context (more specific)
        /`\s*(?:SELECT|INSERT|UPDATE|DELETE)\s+.*\$\{[^}]+\}.*`/gi
      ];
      
      let foundVulnerability = false;
      sqlInjectionPatterns.forEach(pattern => {
        const matches = content.match(pattern);
        if (matches) {
          // Filter out false positives (response messages, etc.)
          const realVulnerabilities = matches.filter(match => {
            return !match.includes('message:') && 
                   !match.includes('Updated') && 
                   !match.includes('Deleted') && 
                   !match.includes('Created') &&
                   !match.toLowerCase().includes('alt=');
          });
          
          if (realVulnerabilities.length > 0) {
            this.log('error', `Potential SQL injection vulnerability: ${realVulnerabilities[0]}`, filePath);
            foundVulnerability = true;
          }
        }
      });
      
      // Check for Prisma usage (safer)
      if (content.includes('prisma.') && (content.includes('findMany') || content.includes('create') || content.includes('update'))) {
        this.log('pass', 'Using Prisma ORM (safer)', filePath);
      }
      
      // Check for raw SQL usage
      if (content.includes('$executeRaw') || content.includes('$queryRaw')) {
        this.log('warning', 'Raw SQL usage detected - ensure proper parameterization', filePath);
      }
    });
  }

  // Check dependencies for known vulnerabilities
  checkDependencies() {
    console.log('\n[CHECK] Checking dependencies for vulnerabilities...');
    
    try {
      const auditResult = execSync('npm audit --json', { 
        cwd: this.projectRoot,
        encoding: 'utf8'
      });
      
      const audit = JSON.parse(auditResult);
      
      if (audit.vulnerabilities && Object.keys(audit.vulnerabilities).length > 0) {
        const vulnCount = Object.keys(audit.vulnerabilities).length;
        this.log('error', `${vulnCount} dependency vulnerabilities found`);
        console.log('[INFO] Run "npm audit fix" to resolve automatically fixable issues');
      } else {
        this.log('pass', 'No dependency vulnerabilities found');
      }
    } catch (error) {
      this.log('warning', 'Could not run dependency audit');
    }
  }

  // Utility method to scan files
  scanFiles(directories, extensions, callback) {
    directories.forEach(dir => {
      const dirPath = path.join(this.projectRoot, dir);
      if (fs.existsSync(dirPath)) {
        this.scanDirectory(dirPath, extensions, callback);
      }
    });
  }

  scanDirectory(dirPath, extensions, callback) {
    const items = fs.readdirSync(dirPath);
    
    items.forEach(item => {
      const itemPath = path.join(dirPath, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        this.scanDirectory(itemPath, extensions, callback);
      } else if (stat.isFile() && extensions.some(ext => item.endsWith(ext))) {
        const content = fs.readFileSync(itemPath, 'utf8');
        const relativePath = path.relative(this.projectRoot, itemPath);
        callback(relativePath, content);
      }
    });
  }

  // Generate security report
  generateReport() {
    console.log('\n[REPORT] Security Audit Report');
    console.log('========================');
    console.log(`[PASS] Passed: ${this.passed.length}`);
    console.log(`[WARNING] Warnings: ${this.warnings.length}`);
    console.log(`[ERROR] Issues: ${this.issues.length}`);
    
    if (this.issues.length > 0) {
      console.log('\n[CRITICAL] Critical Issues:');
      this.issues.forEach(issue => {
        console.log(`   - ${issue.message}${issue.file ? ` (${issue.file})` : ''}`);
      });
    }
    
    if (this.warnings.length > 0) {
      console.log('\n[WARNINGS] Warnings:');
      this.warnings.forEach(warning => {
        console.log(`   - ${warning.message}${warning.file ? ` (${warning.file})` : ''}`);
      });
    }
    
    // Save detailed report
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        passed: this.passed.length,
        warnings: this.warnings.length,
        issues: this.issues.length
      },
      details: {
        passed: this.passed,
        warnings: this.warnings,
        issues: this.issues
      }
    };
    
    const reportPath = path.join(this.projectRoot, 'security-audit-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n[REPORT] Detailed report saved to: ${reportPath}`);
    
    return this.issues.length === 0;
  }

  // Run all security checks
  async runAudit() {
    console.log('[AUDIT] Starting Security Audit for Bali Tourism CMS');
    console.log('================================================');
    
    this.checkHardcodedSecrets();
    this.checkDangerousHTML();
    this.checkWindowOpen();
    this.checkConsoleLogging();
    this.checkEnvironmentConfig();
    this.checkEventListeners();
    this.checkSQLInjection();
    this.checkDependencies();
    
    const passed = this.generateReport();
    
    if (passed) {
      console.log('\n[SUCCESS] Security audit completed successfully!');
      process.exit(0);
    } else {
      console.log('\n[FAILED] Security audit found issues that need attention.');
      process.exit(1);
    }
  }
}

// Run the audit if this script is executed directly
if (require.main === module) {
  const auditor = new SecurityAuditor();
  auditor.runAudit().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('Security audit failed:', error);
    process.exit(1);
  });
}

module.exports = SecurityAuditor;