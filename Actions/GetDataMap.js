async function GetDataMap(page, action) {
  await page.goto(action.url, {
    waitUntil: 'domcontentloaded',
  });
  //取得營業所總數
  await page.waitForSelector('select[name="dep"]', { timeout: 60000 });
  let selects = await page.$('select[name="dep"]');
  const optionList = await page.evaluate((selectElement) => {
    const options = Array.from(selectElement.querySelectorAll('option'));
    const optionValues = options.map((option) => option.value);
    return optionValues;
  }, selects);
  const formName = action.formName;
  const today = new Date();
  const dataDate = new Date(today.setDate(today.getDate() - 1));
  //民國年
  let dataYear = (dataDate.getFullYear() - 1911).toString();
  // 月份从 0 开始，所以要加 1
  let dataMonth = (dataDate.getMonth() + 1).toString();
  let dataDay = dataDate.getDate().toString();
  let result = [];
  result.push(action.titles);

  for (var i = 0; i < optionList.length; i++) {
    process.stdout.write(`${action.fileName}取得.....${i}/${optionList.length}\r`);
    await page.goto(action.url, {
      waitUntil: 'domcontentloaded',
    });
    const factoryNo = await page.evaluate(async (item) => {
      return item.split('/')[0];
    }, optionList[i]);
    const companyName = await page.evaluate(async (item) => {
      return item.split('/')[1];
    }, optionList[i]);
    await page.waitForSelector('select[name="dep"]', { timeout: 60000 });
    await page.select('select[name="dep"]', optionList[i]);
    //開始年月日
    await page.waitForSelector('select[name="stayear"]', { timeout: 60000 });
    await page.select('select[name="stayear"]', dataYear);
    await page.select('select[name="stamonth"]', dataMonth);
    await page.select('select[name="staday"]', dataDay);
    //結束年月日
    await page.waitForSelector('select[name="endyear"]', { timeout: 60000 });
    await page.select('select[name="endyear"]', dataYear);
    await page.select('select[name="endmonth"]', dataMonth);
    await page.select('select[name="endday"]', dataDay);
    await page.waitForSelector('#submitDiv', { timeout: 60000 });
    await page.click('#submitDiv');
    //等待頁面跳轉
    await page.waitForSelector('input[name="act"]', { timeout: 60000 });
    const formGetName = await page.$(`form[name="${formName}"]`);
    const formExists = await page.evaluate(async (formName) => {
      const chk = formName !== null;
      return chk;
    }, formGetName);
    if (!formExists) continue;
    await page.waitForSelector(`form[name="${formName}"]`, { timeout: 60000 });
    const formElement = await page.$(`form[name="${formName}"]`);

    const trArr = await page.evaluate(async (formElement) => {
      const centerElements = formElement.querySelectorAll('center');
      const secondCenterElement = centerElements[1];
      const tableElement = secondCenterElement.querySelector('table');
      const tbodyElement = tableElement.querySelector('tbody');
      const trElements = tbodyElement.querySelectorAll('tr');
      const trArr = [];
      trElements.forEach(async (trElement) => {
        const tdElements = trElement.querySelectorAll('td');
        const tdText = Array.from(tdElements).map((tdElement) => tdElement.innerText);
        trArr.push(tdText);
      });
      return trArr;
    }, formElement);

    const trDatas = await page.evaluate(
      async (trArr, factoryNo, companyName) => {
        let tempArr = [];
        trArr.shift();
        trArr.map((item, index) => {
          tempArr.push([factoryNo, companyName, ...item]);
        });
        return tempArr;
      },
      trArr,
      factoryNo,
      companyName
    );
    result.push(...trDatas);
  }
  process.stdout.write(
    `${action.fileName}資料取得.....${optionList.length}/${optionList.length}\r\n`
  );
  return result;
}

exports.GetDataMap = GetDataMap;
