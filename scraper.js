const puppeteer = require("puppeteer");
const moment = require("moment");
// utiliser le "file system"
const fs =require('fs').promises;


const scrap = async () => {
  try {
    var browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // to view the requests done and select the ones you want
    // to learn more about that part
    await page.setRequestInterception(true);
    page.on("request", request => {
      if (["stylesheet", "image", "font"].includes(request.resourceType()))
        request.abort();
      else request.continue();
    });

    // URL where we needs data from with max elements
    await page.goto(
      "https://www.welcometothejungle.com/fr/jobs?refinementList%5Boffices.country_code%5D%5B%5D=FR&refinementList%5Boffices.state%5D%5B%5D=%C3%8Ele-de-France&refinementList%5Bcontract_type%5D%5B%5D=INTERNSHIP&refinementList%5Bcontract_type%5D%5B%5D=APPRENTICESHIP&refinementList%5Bcontract_type%5D%5B%5D=FULL_TIME&refinementList%5Bcontract_type%5D%5B%5D=TEMPORARY&refinementList%5Bexperience_level_minimum%5D%5B%5D=0-1&refinementList%5Bexperience_level_minimum%5D%5B%5D=1-3&refinementList%5Bhas_experience_level_minimum%5D%5B%5D=0&query=javascript&page=1&aroundQuery=%C3%8Ele-de-France%2C%20France&sortBy=mostRecent", 
      {
        waitUntil : "networkidle2",  
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

    const limitDate = moment().subtract(1, "days").toDate();
    console.log(limitDate);

    // $$eval c'est lorqu'il y a plusieur élément pour avoir un tableau
    // if you want to use an argument, it has to be added after selector ($$eval(selector, pageFunction, args))
    const jobList = await page.$$eval("li.ais-Hits-list-item", (arr, limitDate) => {
      return arr.map( e => {
        const url = e.querySelector("a").href;
        const jobTitle = e.querySelector("h4").textContent.trim();
        const tags = Array.from(
          e.querySelectorAll("div[role='listitem']")
          ).map(item => item.textContent.trim());
        // pour utiliser il faut mettre dateTime avec T majuscule JS vanilla...
        const createdAt = e.querySelector("time").dateTime;
        
        return { url, jobTitle, tags, createdAt };
      }).filter(el => new Date(el.createdAt) > new Date(limitDate))
    }, limitDate);

    // create a file with data in json file :
    await fs.writeFile(
      `./jobs-${Date.now()}.json`,
      JSON.stringify(jobList, null, 2));
    // console.log(jobList);
    console.log(totalJobs);
    console.log(jobList.length);

  } catch (error) {
    console.error(error);
  } finally {
    await browser.close();
  }
}

module.exports = scrap