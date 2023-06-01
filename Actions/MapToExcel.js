const XLSX = require('xlsx');
const fs = require('fs');
const ExcelJS = require('exceljs');

async function MapToExcel(list,params) {
  process.stdout.write(`表單: ${params.fileName}.xls 儲存.....執行\r`);
  // 建立 Workbook 物件
  const workbook = XLSX.utils.book_new();
  // 將二維陣列轉換成工作表
  const worksheet = XLSX.utils.aoa_to_sheet(list);
  // 將工作表新增到 Workbook 中
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  // 將 Workbook 寫入二進位格式
  const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xls' });

  const folderPath = `${ params.savePath }/${ params.foldeName }`;
  // 檢查資料夾是否存在，不存在則建立
  fs.existsSync(folderPath) || fs.mkdirSync(folderPath);
  // 指定下載路徑
  const downloadPath = `${ folderPath }/${ params.fileName }.xls`;
  // 檢查檔案是否存在，存在則刪除
  fs.existsSync(downloadPath) && fs.unlinkSync(downloadPath);

  // 將二進位資料寫入檔案
  fs.writeFile(downloadPath, excelBuffer, (err) => {
    if (err) {
      process.stdout.write(`表單: ${params.fileName}.xls 儲存.....失敗\r\n`);
      return;
    }
  process.stdout.write(`表單: ${params.fileName}.xls 儲存.....成功\r\n`);
  });
}

exports.MapToExcel = MapToExcel;