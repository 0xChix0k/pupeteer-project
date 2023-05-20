const puppeteer = require('puppeteer');
const login = require('./login').login;
const userInfo = require('./userInfo.json');
const dataInfo = require('./dataInfo.json');

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: userInfo.executablePath,
    args: ['--window-size=1920,1080'],
    defaultViewport: null,
  });
  const page = await browser.newPage();

  await page.goto(userInfo.homePage, {
    waitUntil: 'domcontentloaded',
  });

  login(page);

  await page.waitForSelector('frame[name="Index"]');
  console.log('login success');

  //進貨
  // await page.goto(dataInfo.pageUrl.purchase, {
  //   waitUntil: 'domcontentloaded',
  // });

  //取得營業所總數
  let selectElement = page.$('select[name="dep"]');
  const options = await page.evaluate((selectElement) => {
    return selectElement.querySelectorAll('option');
  }, selectElement);
  //開始執行迴圈
  Array.from(options).forEach((option) => {
    console.log(option.value);
  });

  const { dataYear, dataMonth, dataDay } = getYesterdayDate();
  //年份/批次
  const sYearMonth = `${dataYear}/${dataMonth}-1`;
  await page.waitForSelector('select[name="YearMonth"]');
  await page.select('select[name="YearMonth"]', sYearMonth);
  //開始年月日
  await page.select('select[name="stayear"]', dataYear);
  await page.select('select[name="stamonth"]', dataMonth);
  await page.select('select[name="staday"]', dataDay);
  //結束年月日
  await page.select('select[name="endyear"]', dataYear);
  await page.select('select[name="endmonth"]', dataMonth);
  await page.select('select[name="endday"]', dataDay);

  await page.click('#submitDiv');

  // await browser.close();
})();

function getYesterdayDate() {
  const today = new Date();
  const dataDate = new Date(today.setDate(today.getDate() - 1));
  //民國年
  var dataYear = dataDate.getFullYear() - 1911;
  // 月份从 0 开始，所以要加 1
  var dataMonth = dataDate.getMonth() + 1;
  var dataDay = dataDate.getDate();

  return { dataYear, dataMonth, dataDay };
}
