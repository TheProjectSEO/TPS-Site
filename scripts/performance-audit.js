#!/usr/bin/env node

const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

async function runLighthouse() {
  const chrome = await chromeLauncher.launch({chromeFlags: ['--headless']});
  const options = {
    logLevel: 'info',
    output: 'html',
    onlyCategories: ['performance'],
    port: chrome.port,
  };

  const runnerResult = await lighthouse('http://localhost:3000', options);

  // Extract metrics
  const lcp = runnerResult.lhr.audits['largest-contentful-paint'];
  const fid = runnerResult.lhr.audits['max-potential-fid'];
  const cls = runnerResult.lhr.audits['cumulative-layout-shift'];
  const fcp = runnerResult.lhr.audits['first-contentful-paint'];
  const si = runnerResult.lhr.audits['speed-index'];

  console.log('Performance Metrics:');
  console.log(`LCP: ${lcp.displayValue} (${lcp.score >= 0.9 ? '✅' : '❌'})`);
  console.log(`FCP: ${fcp.displayValue} (${fcp.score >= 0.9 ? '✅' : '❌'})`);
  console.log(`CLS: ${cls.displayValue} (${cls.score >= 0.9 ? '✅' : '❌'})`);
  console.log(`SI: ${si.displayValue} (${si.score >= 0.9 ? '✅' : '❌'})`);
  console.log(`Performance Score: ${runnerResult.lhr.categories.performance.score * 100}/100`);

  // Save report
  const fs = require('fs');
  fs.writeFileSync('lighthouse-report.html', runnerResult.report);
  console.log('\nFull report saved to lighthouse-report.html');

  await chrome.kill();
}

runLighthouse().catch(console.error);