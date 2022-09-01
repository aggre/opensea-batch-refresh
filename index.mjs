import puppeteer from "puppeteer";

const MAX_TOKEN_ID = 3;
const BASE =
  "https://opensea.io/assets/matic/0x89904de861cded2567695271a511b3556659ffa2";

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();
  console.log("browser prepared");

  Promise.all(
    new Array(MAX_TOKEN_ID).fill(null).map(async (_, i) => {
      const id = i + 1;
      await page.goto(`${BASE}/${id}`);
      console.log(id, "page loaded");
      await page.waitForSelector("#main button:first-child");
      console.log(id, "refresh button found");
      await page.evaluate(() => {
        document.querySelector("#main button:first-child").click();
        console.log(id, "clicked the refresh button");
      });
      await page.waitForSelector("[data-testid=toasts]");
      console.log(id, "finished");
    })
  );
})();
