const userInfo = require("../userInfo.json");
const GetValidNum = require("./GetValidNum");

async function Login(page) {
  process.stdout.write(`前往頁面.....執行\r`);
  await page.goto(userInfo.homePage, {
    waitUntil: "domcontentloaded",
  });
  process.stdout.write(`前往頁面.....完成\r\n`);

  for (let attempt = 0; attempt < 3; attempt++) {
    process.stdout.write(`自動登入.....執行\r`);
    await page.waitForSelector("#thisForm");
    await page.type("#userId", userInfo.userId), { delay: 100 };
    await page.type("#userPwd", userInfo.passwd), { delay: 100 };
    await page.click("#securityImg");
    await page.waitForTimeout(1500);
    const captchaImage = await page.$("#securityImg");
    const fileName = "captcha.png";
    await captchaImage.screenshot({ path: fileName });
    const validNumber = await GetValidNum(fileName);
    await page.type("#securityId", validNumber, { delay: 100 });
    await page.click("#loginButton");
    await page.waitForTimeout(1500);
    await page.waitForNavigation();

    if (page.url() === userInfo.loginCheck.fail) {
      process.stdout.write(`登入失敗.....重試\r\n`);
    } else {
      process.stdout.write(`自動登入.....完成\r\n`);
      break; // 登入成功，跳出循環
    }
  }
}

exports.Login = Login;
