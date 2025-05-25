const express = require('express');
const { chromium } = require('playwright');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/visit', async (req, res) => {
  try {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      viewport: { width: 1280, height: 800 }
    });
    const page = await context.newPage();
    await page.goto('https://myunihub.ro', { waitUntil: 'load' });
    await page.waitForTimeout(5000);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    await browser.close();
    res.send('✅ Vizită terminată. Site-ul a fost încărcat cu succes.');
  } catch (err) {
    console.error(err);
    res.status(500).send('❌ Eroare la accesarea site-ului.');
  }
});

app.get('/', (req, res) => {
  res.send('Serverul funcționează. Accesează /visit pentru a simula o vizită.');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});