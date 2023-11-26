const puppeteer = require("puppeteer");

const scrap = async () => {
  try {
    var browser = await puppeteer.launch({ headless: false });

  } catch (error) {
    console.log(error);
  } finally {
    await browser.close();
  }
}

module.exports = scrap