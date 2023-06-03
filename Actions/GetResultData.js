async function GetResultData(params, action) {
  const { purchaseList: purchase, backList: back } = params;
  const temps = [];

  process.stdout.write(`${action.fileName}產生.....執行\r`);

  // 進貨比對出貨 計算剩餘數量
  await Promise.all(
    purchase.map(async (item, index) => {
      if (index === 0) return;
      let tempBackCount = 0;
      const [pFNo, pCNo, serial, pCode, barcode, name, purchase, remark] = item;

      await Promise.all(
        back.map((item, index) => {
          if (index === 0) return;
          const [bFNo, bCNo, serial, date, bCode, barcode, name, cBack, remark] = item;
          const chk = pFNo === bFNo && pCNo === bCNo && pCode === bCode;
          if (chk) {
            tempBackCount = cBack;
            return;
          }
        })
      );
      const remain = purchase - tempBackCount;
      const row = [pFNo, pCNo, serial, pCode, barcode, name, purchase, tempBackCount, remain];
      temps.push(row);
    })
  );

  // 退貨比對進貨 寫進無進貨的項目
  const ZERO = 0;
  await Promise.all(
    back.map(async (item, index) => {
      if (index === 0) return;
      const [bFNo, bCNo, bSerial, bDate, bCode, barcode, bName, bBack, bRemark] = item;
      const isExist = temps.some((item) => {
        const [tFNo, tCNo, tSerial, tCode, tBarcode, tName, tPurchase, tBack, tRemain] = item;
        return tFNo === bFNo && tCNo === bCNo && tCode === bCode;
      });
      if (isExist === false) {
        temps.push([bFNo, bCNo, bSerial, bCode, barcode, bName, ZERO, bBack, ZERO - bBack]);
      }
    })
  );

  // 重新排序
  temps.sort((a, b) => {
    const aFNo = a[0];
    const bFNo = b[0];
    const aCode = a[3];
    const bCode = b[3];
    if (a[0] !== b[0]) {
      return aFNo - bFNo;
    } else {
      return aCode - bCode;
    }
  });

  process.stdout.write(`${action.fileName}產生.....完成\r\n`);
  return [action.titles, ...temps];
}

exports.GetResultData = GetResultData;
