let fs = require('fs');

/* 동기식 처리 : 순차적으로 진행
// readFileSync
console.log('A');
let result = fs.readFileSync('Syntax/sample.txt','utf8');
console.log(result);
console.log('C');
*/

// 비동기식 처리 : 콜백함수가 실행되면서 함수의 결과가 마지막에 출력
console.log('A');
fs.readFile('Syntax/sample.txt','utf8',function (err,result) {
  console.log(result);
});
console.log('C');
