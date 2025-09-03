const { default: lighthouse } = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const path = require('path');

async function runLighthouseAudit(url, outputDir) {
  // Chrome'u başlat
  const chrome = await chromeLauncher.launch({chromeFlags: ['--headless']});
  const options = {
    logLevel: 'info',
    output: 'html',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    port: chrome.port
  };
  const config = null;

  try {
    // Lighthouse audit'i çalıştır
    const runnerResult = await lighthouse(url, options, config);

    // Sonuçları kaydet
    const htmlReport = runnerResult.report;
    const reportPath = path.join(outputDir, 'lighthouse-report.html');
    fs.writeFileSync(reportPath, htmlReport);

    // Skorları konsola yazdır
    console.log('Lighthouse audit sonuçları:');
    console.log(`Performans: ${runnerResult.lhr.categories.performance.score * 100}`);
    console.log(`Erişilebilirlik: ${runnerResult.lhr.categories.accessibility.score * 100}`);
    console.log(`En İyi Uygulamalar: ${runnerResult.lhr.categories['best-practices'].score * 100}`);
    console.log(`SEO: ${runnerResult.lhr.categories.seo.score * 100}`);

    console.log(`Rapor şu adrese kaydedildi: ${reportPath}`);

    return runnerResult.lhr;
  } catch (error) {
    console.error('Lighthouse audit sırasında hata oluştu:', error);
  } finally {
    // Chrome'u kapat
    await chrome.kill();
  }
}

// Script'i çalıştır
(async () => {
  const url = process.argv[2] || 'http://localhost:3000';
  const outputDir = process.argv[3] || './reports';
  
  // Çıktı dizinini oluştur
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  await runLighthouseAudit(url, outputDir);
})();