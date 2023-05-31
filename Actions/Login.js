const userInfo = require('../userInfo.json');
const GetValidNum = require('./GetValidNum');

async function Login(page) {
  process.stdout.write(`前往頁面.....執行\r`);
  await page.goto(userInfo.homePage, {
    waitUntil: 'domcontentloaded',
  });
  process.stdout.write(`前往頁面.....完成\r\n`);
  while (true) {
    process.stdout.write(`自動登入.....執行\r`);
    await page.waitForSelector('#thisForm');
    await page.type('#userId', userInfo.userId), { delay: 100 };
    await page.type('#userPwd', userInfo.passwd), { delay: 100 };
    await page.click('#securityImg');
    await page.waitForTimeout(1500);
    const captchaImage = await page.$('#securityImg');
    const fileName = 'captcha.png';
    await captchaImage.screenshot({ path: fileName });
    const validNumber = await GetValidNum(fileName);
    await page.type('#securityId', validNumber, { delay: 100 });
    await page.click('#loginButton');
    if (page.url() !== userInfo.loginCheck.fail) {
      process.stdout.write(`自動登入.....完成\r\n`);
      break;
    } else {
      process.stdout.write(`自動登入.....失敗\r`);
      continue;
    }
  }
}

exports.Login = Login;
