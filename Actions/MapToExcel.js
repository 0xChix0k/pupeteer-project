const fs = require('fs');
const ExcelJS = require('exceljs');

async function MapToExcel(list, params) {
  process.stdout.write(`表單: ${params.fileName}.xls 儲存.....執行\r`);
  // 建立 Workbook 物件
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');
  worksheet.addRows(list);
  //  获取标题行
  const headerRow = worksheet.getRow(1);
  // 遍历每个单元格，并根据条件设置数据类型为Number
  headerRow.eachCell((cell, colNumber) => {
    const columnName = cell.value;
    if (params.numericCol.includes(columnName)) {
      const column = worksheet.getColumn(colNumber);
      column.eachCell((cell) => {
        const value = parseFloat(cell.value);
        cell.value = isNaN(value) ? cell.value : value;
      });
    }
  });

  const folderPath = `${params.savePath}/${params.foldeName}`;
  // 檢查資料夾是否存在，不存在則建立
  fs.existsSync(folderPath) || fs.mkdirSync(folderPath);
  // 指定下載路徑
  const downloadPath = `${folderPath}/${params.fileName}.xls`;
  // 檢查檔案是否存在，存在則刪除
  fs.existsSync(downloadPath) && fs.unlinkSync(downloadPath);

  await workbook.xlsx.writeFile(downloadPath, { fileType: 'xls' });
  process.stdout.write(`表單: ${params.fileName}.xls 儲存.....成功\r\n`);
}

exports.MapToExcel = MapToExcel;
