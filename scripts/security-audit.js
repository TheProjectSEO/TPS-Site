#!/usr/bin/env node

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🔒 Starting Security Audit...\n')

// Check for npm audit vulnerabilities
console.log('📦 Running npm audit...')
try {
  const auditResult = execSync('npm audit --json', { encoding: 'utf8' })
  const audit = JSON.parse(auditResult)
  
  if (audit.vulnerabilities && Object.keys(audit.vulnerabilities).length > 0) {
    console.log('⚠️  Vulnerabilities found:')
    Object.entries(audit.vulnerabilities).forEach(([name, vuln]) => {
      console.log(`  - ${name}: ${vuln.severity} (${vuln.via.join(', ')})`)
    })
  } else {
    console.log('✅ No vulnerabilities found')
  }
} catch (error) {
  console.log('⚠️  npm audit failed:', error.message)
}

// Check for sensitive files
console.log('\n🔍 Checking for sensitive files...')
const sensitivePatterns = [
  '.env',
  '.env.local',
  '.env.production',
  '*.pem',
  '*.key',
  '*.p12',
  '*.pfx',
  'id_rsa',
  'id_dsa',
]

const sensitiveFiles = []
function checkDirectory(dir) {
  try {
    const files = fs.readdirSync(dir)
    files.forEach(file => {
      const filePath = path.join(dir, file)
      const stat = fs.statSync(filePath)
      
      if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
        checkDirectory(filePath)
      } else {
        sensitivePatterns.forEach(pattern => {
          if (file.match(pattern.replace('*', '.*'))) {
            sensitiveFiles.push(filePath)
          }
        })
      }
    })
  } catch (error) {
    // Ignore permission errors
  }
}

checkDirectory('.')
if (sensitiveFiles.length > 0) {
  console.log('⚠️  Sensitive files found:')
  sensitiveFiles.forEach(file => console.log(`  - ${file}`))
} else {
  console.log('✅ No sensitive files found in repository')
}

// Check package.json for security configs
console.log('\n📋 Checking package.json security configurations...')
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))

const securityChecks = [
  {
    name: 'Scripts audit',
    check: () => packageJson.scripts && packageJson.scripts.audit,
    message: 'No audit script found. Consider adding "audit": "npm audit"'
  },
  {
    name: 'Security dependencies',
    check: () => {
      const devDeps = packageJson.devDependencies || {}
      return devDeps['eslint-plugin-security'] || devDeps['audit-ci']
    },
    message: 'No security linting tools found'
  }
]

securityChecks.forEach(({ name, check, message }) => {
  if (check()) {
    console.log(`✅ ${name}: OK`)
  } else {
    console.log(`⚠️  ${name}: ${message}`)
  }
})

// Check environment variables usage
console.log('\n🔐 Checking environment variable usage...')
const envUsagePattern = /process\.env\.[A-Z_]+/g
const srcFiles = []

function findJSFiles(dir) {
  try {
    const files = fs.readdirSync(dir)
    files.forEach(file => {
      const filePath = path.join(dir, file)
      const stat = fs.statSync(filePath)
      
      if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
        findJSFiles(filePath)
      } else if (file.match(/\.(js|jsx|ts|tsx)$/)) {
        srcFiles.push(filePath)
      }
    })
  } catch (error) {
    // Ignore permission errors
  }
}

findJSFiles('src')
const envUsage = new Set()

srcFiles.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf8')
    const matches = content.match(envUsagePattern)
    if (matches) {
      matches.forEach(match => envUsage.add(match))
    }
  } catch (error) {
    // Ignore read errors
  }
})

if (envUsage.size > 0) {
  console.log('📝 Environment variables used:')
  Array.from(envUsage).sort().forEach(env => console.log(`  - ${env}`))
} else {
  console.log('✅ No environment variables found in source code')
}

console.log('\n🔒 Security audit complete!')
console.log('\n📝 Recommendations:')
console.log('  1. Run npm audit regularly')
console.log('  2. Keep dependencies updated')
console.log('  3. Use HTTPS in production')
console.log('  4. Implement proper authentication')
console.log('  5. Validate all user inputs')
console.log('  6. Use environment variables for secrets')
console.log('  7. Enable CSRF protection')
console.log('  8. Set security headers')