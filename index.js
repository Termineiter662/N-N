const express = require('express');
const { chromium } = require('playwright');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/visit', async (req, res) => {
  try {
    console.log('➡️ Vizită începută...');
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
      viewport: { width: 1280, height: 800 }
    });
    const page = await context.newPage();

    page.on('response', response => {
      console.log(`🌐 Răspuns: ${response.status()} - ${response.url()}`);
    });

    page.on('requestfailed', request => {
      console.log(`❌ Cerere eșuată: ${request.url()} - ${request.failure().errorText}`);
    });

    const response = await page.goto('https://myunihub.ro', { waitUntil: 'load', timeout: 15000 });
    if (!response || !response.ok()) {
      throw new Error(`Nu s-a putut încărca site-ul. Cod răspuns: ${response?.status()}`);
    }

    await page.waitForTimeout(5000);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    await browser.close();
    console.log('✅ Vizită finalizată cu succes.');
    res.send('✅ Vizită terminată. Site-ul a fost încărcat cu succes.');
  } catch (err) {
    console.error('❌ Eroare la accesare:', err.message);
    res.status(500).send(`❌ Eroare la accesarea site-ului: ${err.message}`);
  }
});

app.get('/', (req, res) => {
  res.send('Serverul funcționează. Accesează /visit pentru a simula o vizită.');
});

app.listen(PORT, () => {
  console.log(`🚀 Server pornit pe portul ${PORT}`);
});

