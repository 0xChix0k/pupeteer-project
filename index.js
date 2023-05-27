const puppeteer = require('puppeteer');
const Login = require('./Actions/Login').Login;
const GetDataMap = require('./Actions/GetDataMap').GetDataMap;
const GetResultData = require('./Actions/GetResultData').GetResultData;
const MapToExcel = require('./Actions/MapToExcel').MapToExcel;
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

  Login(page);

  await page.waitForSelector('frame[name="Index"]', { timeout: 60000 });
  console.log('login success');

  const purchaseList = await GetDataMap(page, dataInfo.purchase);
  console.log('purchaseList success');

  const backList = await GetDataMap(page, dataInfo.back);
  console.log('backList success');
  
  await browser.close();

  const params = { purchaseList, backList };
  const resultList = await GetResultData(params,dataInfo.result);
  console.log('resultList success');

  const lists = [purchaseList, backList, resultList];
  ['purchase', 'back', 'result'].forEach(async (item, index) => {
    const list = lists[index];
    dateText = item === 'result' ? '' : new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const params = {
      savePath: dataInfo.savePath,
      foldeName: new Date().toLocaleDateString().replace(/\//g, '-'),
      fileName: dataInfo[item].fileName + dateText,
    };
    await MapToExcel(list, params);
  });
})();
