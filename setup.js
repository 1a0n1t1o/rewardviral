#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up your Whop app...\n');

// Check if .env already exists
const envPath = path.join(process.cwd(), '.env');
const envExamplePath = path.join(process.cwd(), 'env.example');

if (fs.existsSync(envPath)) {
  console.log('✅ .env file already exists');
} else if (fs.existsSync(envExamplePath)) {
  try {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ Created .env file from env.example');
    console.log('📝 Please edit .env with your Whop app credentials');
  } catch (error) {
    console.log('❌ Failed to create .env file:', error.message);
  }
} else {
  console.log('❌ env.example file not found');
}

console.log('\n📚 Next steps:');
console.log('1. Edit .env with your Whop app credentials');
console.log('2. Run: pnpm install');
console.log('3. Run: pnpm dev');
console.log('\n📖 For detailed instructions, see SETUP.md');
console.log('🔗 Whop Dashboard: https://whop.com/dashboard/developer/');
