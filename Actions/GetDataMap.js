async function GetDataMap(page, action) {
  await page.goto(action.url, {
    waitUntil: "domcontentloaded",
  });

  //取得營業所總數
  await page.waitForSelector("#deList-list", { timeout: 60000 });
  let selects = await page.$("#deList_listbox");
  await page.waitForSelector("#deList_listbox li", { timeout: 60000 });
  const optionList = await page.evaluate((selectElement) => {
    console.log("selectElement:", selectElement);
    const options = Array.from(selectElement.querySelectorAll("li"));
    console.log("options:", options);
    const optionValues = options.map((option) => option.innerText);
    console.log("optionValues:", optionValues);
    return optionValues;
  }, selects);

  console.log("optionList:", optionList.length);

  const formName = action.formName;
  const isCombin = action.fileName === "各分店合併";
  const today = new Date();
  const dataDate = new Date(today.setDate(today.getDate() - 1));
  //民國年
  let dataYear = (dataDate.getFullYear() - 1911).toString();
  // 月份从 0 开始，所以要加 1
  let dataMonth = (dataDate.getMonth() + 1).toString().padStart(2, "0");
  let dataDay = dataDate.getDate().toString().padStart(2, "0");
  let result = [];
  result.push(action.titles);

  for (var i = 0; i < optionList.length; i++) {
    process.stdout.write(`${action.fileName}取得.....${i}/${optionList.length}\r`);
    await page.goto(action.url, {
      waitUntil: "domcontentloaded",
    });
    const factoryNo = await page.evaluate(async (item) => {
      return item.split("/")[0];
    }, optionList[i]);
    const companyName = await page.evaluate(async (item) => {
      return item.split("/")[1];
    }, optionList[i]);

    await page.waitForSelector("#deList_listbox", { timeout: 60000 });
    //打開廠商選單
    await page.waitForTimeout(2000);
    await page.click("#deDiv .k-dropdown-wrap");
    //點擊廠商選單
    await page.waitForTimeout(1500);
    await page.click(`#deList_listbox li[data-offset-index="${i}"]`);
    await page.waitForTimeout(1000);
    //點擊查詢
    await page.click("btn_search");

    //   if (isCombin === false) {
    //     //開始年月日
    //     await page.waitForSelector('select[name="stayear"]', { timeout: 60000 });
    //     await page.select('select[name="stayear"]', dataYear);
    //     await page.select('select[name="stamonth"]', dataMonth);
    //     await page.select('select[name="staday"]', dataDay);
    //     //結束年月日
    //     await page.waitForSelector('select[name="endyear"]', { timeout: 60000 });
    //     await page.select('select[name="endyear"]', dataYear);
    //     await page.select('select[name="endmonth"]', dataMonth);
    //     await page.select('select[name="endday"]', dataDay);
    //   }
    //   await page.waitForSelector("#submitDiv", { timeout: 60000 });
    //   await page.click("#submitDiv");
    //   //等待頁面跳轉
    //   await page.waitForSelector('input[name="act"]', { timeout: 60000 });
    //   const formGetName = await page.$(`form[name="${formName}"]`);
    //   combinData = true;
    //   if (isCombin) {
    //     combinData = await page.$eval(`form[name="${formName}"]`, (form) => {
    //       return !!form.querySelector("center");
    //     });
    //   }
    //   const formExists = await page.evaluate(
    //     async (formName, combinData) => {
    //       const chk = formName !== null && combinData;
    //       return chk;
    //     },
    //     formGetName,
    //     combinData
    //   );
    //   if (!formExists) continue;
    //   await page.waitForSelector(`form[name="${formName}"]`, { timeout: 60000 });
    //   const formElement = await page.$(`form[name="${formName}"]`);

    //   const trArr = await page.evaluate(async (formElement) => {
    //     const centerElements = formElement.querySelectorAll("center");
    //     const secondCenterElement = centerElements[1];
    //     const tableElement = secondCenterElement.querySelector("table");
    //     const tbodyElement = tableElement.querySelector("tbody");
    //     const trElements = tbodyElement.querySelectorAll("tr");
    //     const trArr = [];
    //     trElements.forEach(async (trElement) => {
    //       const tdElements = trElement.querySelectorAll("td");
    //       const tdText = Array.from(tdElements).map(
    //         (tdElement) => tdElement.innerText
    //       );
    //       trArr.push(tdText);
    //     });
    //     return trArr;
    //   }, formElement);

    //   const trDatas = await page.evaluate(
    //     async (trArr, factoryNo, companyName) => {
    //       let tempArr = [];
    //       trArr.shift();
    //       trArr.map((item) => {
    //         // temps = isCombin ? [...item] : [factoryNo, companyName, ...item];
    //         tempArr.push([factoryNo, companyName, ...item]);
    //       });
    //       return tempArr;
    //     },
    //     trArr,
    //     factoryNo,
    //     companyName
    //   );
    //   result.push(...trDatas);
  }
  // process.stdout.write(
  //   `${action.fileName}資料取得.....${optionList.length}/${optionList.length}\r\n`
  // );
  // return result;
}

exports.GetDataMap = GetDataMap;
