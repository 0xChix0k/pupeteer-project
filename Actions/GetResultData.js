async function GetResultData(params,action) {
  const { purchaseList: purase, backList: back } = params;
  const temps = [];

  await purase.forEach(async (item) => {
    let tempBackCount = 0;
    const { pFNo, pCNo, serial, pCode, barcode, name, purchase, remark } = item;
    await back.forEach((item) => {
      const { bFNo, bCNo, serial, date, bCode, barcode, name, back, remark } = item;
      const chk = pFNo === bFNo && pCNo === bCNo && pCode === bCode;
      if (chk) {
        tempBackCount = back;
        return;
      }
    });
    const remain = purchase - tempBackCount;
    const row = [pFNo, pCNo, serial, pCode, barcode, name, purchase, tempBackCount, remain];
    temps.push(row);
  });
  return [action.titles, ...temps];
}

exports.GetResultData = GetResultData;
