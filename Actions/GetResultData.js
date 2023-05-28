async function GetResultData(params,action) {
  const { purchaseList: purase, backList: back } = params;
  const temps = [];

  process.stdout.write(`${action.fileName}產生.....執行\r`);
  await Promise.all(purase.map(async (item,index) => {
    if(index===0) return;
    let tempBackCount = 0;
    const [ pFNo, pCNo, serial, pCode, barcode, name, purchase, remark ] = item;
    
    await Promise.all(back.map((item,index) => {
      if(index===0) return;
      const [ bFNo, bCNo, serial, date, bCode, barcode, name, back, remark ] = item;
      const chk = pFNo === bFNo && pCNo === bCNo && pCode === bCode;
      if (chk) {
        tempBackCount = back;
        return;
      }
    }));
    const remain = purchase - tempBackCount;
    const row = [pFNo, pCNo, serial, pCode, barcode, name, purchase, tempBackCount, remain];
    temps.push(row);
  }));
  process.stdout.write(`${action.fileName}產生.....完成\r\n`);
  return [action.titles, ...temps];
}

exports.GetResultData = GetResultData;
