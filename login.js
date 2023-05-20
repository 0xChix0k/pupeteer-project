const userInfo = require('./userInfo.json');

async function login(page) {
  while (true) {
    // 等待 #downloadForm 出現
    await page.waitForSelector('#downloadForm');
    await page.type('#userId', userInfo.userId), { delay: 100 };
    await page.type('#userPwd', userInfo.passwd), { delay: 100 };
    await page.waitForTimeout(1000);
    const userInput = await page.evaluate(() => {
      return window.prompt('請輸入圖形驗證碼：');
    });
    await page.type('#securityId', userInput, { delay: 100 });
    await page.click('#loginButton');
    await page.waitForNavigation();
    if (page.url() === userInfo.loginCheck.success) {
      break;
    } else {
      continue;
    }
  }
}

exports.login = login;