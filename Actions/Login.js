const userInfo = require('../userInfo.json');

async function Login(page) {
  await page.goto(userInfo.homePage, {
    waitUntil: 'domcontentloaded',
  });
  while (true) {
    await page.waitForSelector('#thisForm');
    await page.type('#userId', userInfo.userId), { delay: 100 };
    await page.type('#userPwd', userInfo.passwd), { delay: 100 };
    await page.click('#securityImg');
    await page.waitForTimeout(1500);
    const userInput = await page.evaluate(() => {
      return window.prompt('請輸入圖形驗證碼：');
    });
    await page.type('#securityId', userInput, { delay: 100 });
    await page.click('#loginButton');
    await page.waitForNavigation();
    if (page.url() !== userInfo.loginCheck.fail) {
      break;
    } else {
      console.log('Login fail');
      continue;
    }
  }
}

exports.Login = Login;