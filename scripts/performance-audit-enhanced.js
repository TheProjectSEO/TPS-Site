#!/usr/bin/env node

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('⚡ Starting Enhanced Performance Audit...\n')

// Build the application for analysis
console.log('🔨 Building application...')
try {
  execSync('npm run build', { stdio: 'inherit' })
  console.log('✅ Build completed successfully\n')
} catch (error) {
  console.error('❌ Build failed:', error.message)
  process.exit(1)
}

// Analyze bundle size
console.log('📦 Analyzing bundle size...')
try {
  const buildDir = '.next'
  if (fs.existsSync(buildDir)) {
    const stats = execSync('du -sh .next', { encoding: 'utf8' })
    console.log('Build size:', stats.trim())
    
    // Check for large files
    const largeFiles = execSync('find .next -type f -size +1M', { encoding: 'utf8' })
    if (largeFiles.trim()) {
      console.log('⚠️  Large files found:')
      largeFiles.trim().split('\n').forEach(file => {
        const size = execSync(`du -h "${file}"`, { encoding: 'utf8' }).split('\t')[0]
        console.log(`  - ${file}: ${size}`)
      })
    } else {
      console.log('✅ No files larger than 1MB found')
    }
  }
} catch (error) {
  console.log('⚠️  Bundle analysis failed:', error.message)
}

// Check for performance best practices
console.log('\n🎯 Checking performance best practices...')

const performanceChecks = [
  {
    name: 'Next.js Image Optimization',
    check: () => {
      const files = execSync('find src -name "*.tsx" -o -name "*.jsx"', { encoding: 'utf8' })
      const hasNextImage = files.split('\n').some(file => {
        if (!file) return false
        try {
          const content = fs.readFileSync(file, 'utf8')
          return content.includes('next/image')
        } catch {
          return false
        }
      })
      return hasNextImage
    },
    message: 'Using Next.js Image component'
  },
  {
    name: 'Bundle Analysis Configuration',
    check: () => {
      const nextConfig = fs.existsSync('next.config.js')
      if (nextConfig) {
        const content = fs.readFileSync('next.config.js', 'utf8')
        return content.includes('@next/bundle-analyzer')
      }
      return false
    },
    message: 'Bundle analyzer not configured'
  },
  {
    name: 'Dynamic Imports',
    check: () => {
      const files = execSync('find src -name "*.tsx" -o -name "*.jsx"', { encoding: 'utf8' })
      return files.split('\n').some(file => {
        if (!file) return false
        try {
          const content = fs.readFileSync(file, 'utf8')
          return content.includes('dynamic(') || content.includes('import(')
        } catch {
          return false
        }
      })
    },
    message: 'No dynamic imports found - consider code splitting'
  },
  {
    name: 'Performance Monitoring',
    check: () => {
      return fs.existsSync('src/components/performance/PerformanceMonitor.tsx')
    },
    message: 'Performance monitoring not implemented'
  }
]

performanceChecks.forEach(({ name, check, message }) => {
  try {
    if (check()) {
      console.log(`✅ ${name}: OK`)
    } else {
      console.log(`⚠️  ${name}: ${message}`)
    }
  } catch (error) {
    console.log(`❌ ${name}: Error checking - ${error.message}`)
  }
})

// Check package.json for performance-related configurations
console.log('\n📋 Checking package.json for performance configurations...')
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))

const perfConfigs = [
  {
    name: 'Build scripts',
    check: () => packageJson.scripts && packageJson.scripts.build,
    message: 'Build script found'
  },
  {
    name: 'Performance dependencies',
    check: () => {
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies }
      return deps['web-vitals'] || deps['@next/bundle-analyzer']
    },
    message: 'Performance monitoring tools found'
  }
]

perfConfigs.forEach(({ name, check, message }) => {
  if (check()) {
    console.log(`✅ ${name}: ${message}`)
  } else {
    console.log(`⚠️  ${name}: Not configured`)
  }
})

console.log('\n⚡ Performance audit complete!')
console.log('\n📝 Performance Recommendations:')
console.log('  1. Use Next.js Image component for all images')
console.log('  2. Implement code splitting with dynamic imports')
console.log('  3. Monitor Core Web Vitals in production')
console.log('  4. Optimize bundle size regularly')
console.log('  5. Use lazy loading for heavy components')
console.log('  6. Implement proper caching strategies')
console.log('  7. Minimize JavaScript bundle size')
console.log('  8. Use CDN for static assets')
console.log('  9. Enable gzip/brotli compression')
console.log(' 10. Monitor real user metrics (RUM)')