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

  const totalPage = await page.evaluate(() => {
    const pageNavList = Array.from(
      document.querySelectorAll("#pagenav .pagenav li")
    );
    const hrefText = pageNavList[pageNavList.length - 1]
      .querySelector("a")
      .getAttribute("href");

    for (const char of hrefText) {
      if (!isNaN(char)) return char;
    }
  });

  let kenoData = await getKenoNumbers();

  //navigate to page 2
  for (let i = 2; i <= totalPage; i++) {
    await page.evaluate((pageNum) => chosePage(pageNum), i);
    await page.waitForSelector("#containerKQKeno");
    kenoData.push(...(await getKenoNumbers()));
  }

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

  return kenoData;
}

function crawler(getData) {
  (async () => {
    //initial Data
    const data = await crawlData();
    getData(data);

    //new Data on reload
    let isHandlingReload = false;
    page.on("framenavigated", async (frame) => {
      if (frame === page.mainFrame() && !isHandlingReload) {
        isHandlingReload = true;

        const data = await crawlData();
        getData(data);

        isHandlingReload = false;
      }
    });
  })();
}
export { crawler };
