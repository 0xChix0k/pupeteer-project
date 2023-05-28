async function GoExit() {
  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  process.stdout.write('今日任務已完成，請按下Enter結束程式....\r\n');
  process.stdin.on('data', function (data) {
    if (data === '\n') {
      process.exit();
    }
  });
}

module.exports = GoExit;
