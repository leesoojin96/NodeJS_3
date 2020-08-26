/*
function a() {
  console.log('A');
}
*/
let a = function () {
  console.log('A');
}
// a();

function slowFunc(callback) {
// 함수가 매개변수로 콜백을 받고 콜백함수를 실행
  callback();
}
slowFunc(a);
// 자바스크립트는 함수가 값이 되기도한다
