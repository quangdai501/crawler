import puppeteer from "puppeteer";

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();

async function crawlData() {
  await page.goto(
    "https://www.minhchinh.com/xo-so-dien-toan-keno.html#containerKQKeno",
    {
      waitUntil: "networkidle2",
    }
  );

  await page.waitForSelector("#containerKQKeno");

  const kenoDataPageOne = await getKenoNumbers();

  //navigate to page 2

  await page.evaluate(() => chosePage(2));
  await page.waitForSelector("#containerKQKeno");

  const kenoDataPageTwo = await getKenoNumbers();

  async function getKenoNumbers() {
    return await page.evaluate(() => {
      const results = [];
      const wrapperKQKeno = document.querySelectorAll(
        "#containerKQKeno .wrapperKQKeno"
      );

      wrapperKQKeno.forEach((wrapper) => {
        const numbers = Array.from(
          wrapper.querySelectorAll(".boxKQKeno div")
        ).map((div) => div.innerText.trim());

        let time = Array.from(
          wrapper.querySelectorAll(".timeKQ div"),
          (div) => div.innerText
        );

        results.push({ numbers, date: time[0], time: time[1] });
      });

      return results;
    });
  }

  console.log([...kenoDataPageOne, ...kenoDataPageTwo]);

  await browser.close();
}

async function crawler() {
  await crawlData();

  page.on("framenavigated", async (frame) => {
    if (frame === page.mainFrame() && !isHandlingReload) {
      isHandlingReload = true;
      await crawlData();
      isHandlingReload = false;
    }
  });
}
export { crawler };
