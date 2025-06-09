#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function checkFile(filePath, description) {
  if (fs.existsSync(filePath)) {
    log(`✅ ${description} exists`, 'green')
    return true
  } else {
    log(`❌ ${description} missing`, 'red')
    return false
  }
}

function createEnvFile() {
  const envPath = '.env.local'
  const envExamplePath = '.env.example'
  
  if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
    try {
      fs.copyFileSync(envExamplePath, envPath)
      log(`✅ Created ${envPath} from ${envExamplePath}`, 'green')
      log(`⚠️  Please update ${envPath} with your actual configuration`, 'yellow')
    } catch (error) {
      log(`❌ Failed to create ${envPath}: ${error.message}`, 'red')
    }
  } else if (fs.existsSync(envPath)) {
    log(`✅ ${envPath} already exists`, 'green')
  } else {
    log(`❌ ${envExamplePath} not found`, 'red')
  }
}

function runCommand(command, description) {
  try {
    log(`🔄 ${description}...`, 'blue')
    execSync(command, { stdio: 'inherit' })
    log(`✅ ${description} completed`, 'green')
    return true
  } catch (error) {
    log(`❌ ${description} failed: ${error.message}`, 'red')
    return false
  }
}

function main() {
  log('🚀 Bali Tourism CMS Setup', 'cyan')
  log('=' .repeat(50), 'cyan')
  
  // Check prerequisites
  log('\n📋 Checking prerequisites...', 'bright')
  
  const checks = [
    checkFile('package.json', 'package.json'),
    checkFile('prisma/schema.prisma', 'Prisma schema'),
    checkFile('.env.example', 'Environment example file'),
  ]
  
  if (!checks.every(Boolean)) {
    log('\n❌ Some prerequisites are missing. Please ensure all required files exist.', 'red')
    process.exit(1)
  }
  
  // Create environment file
  log('\n🔧 Setting up environment...', 'bright')
  createEnvFile()
  
  // Install dependencies
  log('\n📦 Installing dependencies...', 'bright')
  if (!runCommand('npm install --legacy-peer-deps', 'Installing dependencies')) {
    log('\n❌ Failed to install dependencies. Please run manually: npm install --legacy-peer-deps', 'red')
    process.exit(1)
  }
  
  // Generate Prisma client
  log('\n🗄️  Setting up database...', 'bright')
  if (!runCommand('npx prisma generate', 'Generating Prisma client')) {
    log('\n❌ Failed to generate Prisma client. Please run manually: npx prisma generate', 'red')
    process.exit(1)
  }
  
  // Success message
  log('\n🎉 Setup completed successfully!', 'green')
  log('\n📝 Next steps:', 'bright')
  log('1. Update .env.local with your database URL and other configuration', 'yellow')
  log('2. Set up your PostgreSQL database', 'yellow')
  log('3. Run: npm run db:push (to create database tables)', 'yellow')
  log('4. Run: npm run dev (to start the development server)', 'yellow')
  log('5. Visit: http://localhost:3000/admin-dashboard', 'yellow')
  
  log('\n📚 For more information, check the README.md file', 'cyan')
}

if (require.main === module) {
  main()
}

module.exports = { main }