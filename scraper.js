const puppeteer = require("puppeteer");

const scrap = async () => {
  try {
    var browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    // URL where we needs data from with max elements
    await page.goto(
      "https://www.welcometothejungle.com/fr/jobs?refinementList%5Boffices.country_code%5D%5B%5D=FR&refinementList%5Boffices.state%5D%5B%5D=%C3%8Ele-de-France&refinementList%5Bcontract_type%5D%5B%5D=INTERNSHIP&refinementList%5Bcontract_type%5D%5B%5D=FULL_TIME&refinementList%5Bcontract_type%5D%5B%5D=TEMPORARY&query=d%C3%A9veloppeur%20javascript&page=1&aroundQuery=%C3%8Ele-de-France%2C%20France&sortBy=mostRecent", 
      {
        waitUntil : "domcontentloaded",  
      }
    );

    const totalJobs = await page.$eval(
      "div[data-testid='jobs-search-results-count']",
      el => {
        if (el) {
          return Number(el.textContent.trim());
        }
        return null;
      }
    );
    console.log(totalJobs);

  } catch (error) {
    console.error(error);
  } finally {
    // await browser.close();
  }
}

module.exports = scrap