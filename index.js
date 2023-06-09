const puppeteer = require("puppeteer");
const Login = require("./Actions/Login").Login;
const GetDataMap = require("./Actions/GetDataMap").GetDataMap;
const GetResultData = require("./Actions/GetResultData").GetResultData;
const MapToExcel = require("./Actions/MapToExcel").MapToExcel;
const userInfo = require("./userInfo.json");
const dataInfo = require("./dataInfo.json");

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    // headless: false,
    executablePath: userInfo.executablePath,
    args: ["--window-size=1920,1080"],
    defaultViewport: null,
  });
  const page = await browser.newPage();

  await Login(page);

  await page.waitForSelector("#sldDiv", { timeout: 60000 });
  await page.click("#sldDiv > ul > li:nth-child(10) > a");

  await page.waitForSelector('frame[name="Index"]', { timeout: 60000 });

  const combinList = await GetDataMap(page, dataInfo.combin);
  const purchaseList = await GetDataMap(page, dataInfo.purchase);
  const backList = await GetDataMap(page, dataInfo.back);

  await browser.close();

  const params = { purchaseList, backList };
  const resultList = await GetResultData(params, dataInfo.result);
  const lists = [combinList, purchaseList, backList, resultList];
  ["combin", "purchase", "back", "result"].map(async (item, index) => {
    const list = lists[index];
    dateText = item === "result" ? "" : new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const params = {
      savePath: dataInfo.savePath,
      foldeName: new Date().toLocaleDateString().replace(/\//g, "-"),
      fileName: dataInfo[item].fileName + dateText,
      numericCol: dataInfo.numericCol,
    };
    await MapToExcel(list, params);
  });
})();
