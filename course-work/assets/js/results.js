function getResult1() {
  return localStorage.getItem('level_1');
}

function getResult2() {
  return localStorage.getItem('level_2');
}

function getResult3() {
  return localStorage.getItem('level_3');
}

function getAllResults() {
  return parseInt(getResult1()) + parseInt(getResult2()) + parseInt(getResult3());
}

document.addEventListener("DOMContentLoaded", function () {
  let resultText = document.getElementById('resByName');
  let name = localStorage.getItem('name');
  resultText.textContent = 'Поздравляем, ' + name + '!';

  let allResElement = document.getElementById('sum');
  let res = getAllResults().toString();
  allResElement.textContent = 'Всего: ' + res;

  let lvl1Element = document.getElementById('lvl1');
  lvl1Element.textContent = 'Уровень 1: ' + getResult1().toString();

  let lvl2Element = document.getElementById('lvl2');
  lvl2Element.textContent = 'Уровень 2: ' + getResult2().toString();

  let lvl3Element = document.getElementById('lvl3');
  lvl3Element.textContent = 'Уровень 3: ' + getResult3().toString();

  let recordByName = localStorage.getItem('rec_' + name);
  if (parseInt(res) > parseInt(recordByName)) {
    localStorage.setItem('rec_' + name, res);
  }

  //сохранение рекорда
  let records = JSON.parse(localStorage.getItem('userRecords')) || [];

  let existingUser = records.find(function(record) {
    return record.name === name;
  });

  if (existingUser && existingUser.score <= parseInt(res)) {
    existingUser.score = res;
  } else {
    records.push({ name: name, score: res });
  }
  localStorage.setItem('userRecords', JSON.stringify(records));

});
