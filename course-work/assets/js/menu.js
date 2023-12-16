let textInput = document.getElementById('name');
let recordsButton = document.getElementById('records');
let closeRecordsButton = document.getElementById('closeRecords');
let recordList = document.getElementById('recordList');
let usersRecords = document.getElementById('usersRecords');
let clearRecordsButton = document.getElementById('clearRecords');

clearRecordsButton.addEventListener('click', function () {
  usersRecords.innerText = '';
  localStorage.removeItem('userRecords');
});

recordsButton.addEventListener('click',function () {
  recordList.style.display = 'block';
  let storedRecords = JSON.parse(localStorage.getItem('userRecords')) || [];
  usersRecords.innerText = '';
  storedRecords.forEach(function (record) {
    let listItem = document.createElement('li');
    listItem.textContent = record.name + ': ' + record.score;
    usersRecords.appendChild(listItem);
  });
});

closeRecordsButton.addEventListener('click',function () {
  recordList.style.display = 'none';
});

textInput.addEventListener('input', function () {
  let nameInput = this.value.trim();
  let startButton = document.getElementById('startButton');
  let startLink = document.getElementById('startLink');

  if (nameInput !== '') {
    startButton.removeAttribute('disabled');
    startLink.href = 'pages/level1.html';
  } else {
    startButton.setAttribute('disabled', 'true');
    startLink.removeAttribute('href');
  }
});

document.getElementById('startButton').addEventListener('click', function () {
  let textArea = document.getElementById('name');
  localStorage.setItem('name', textInput.value);
  localStorage.setItem('level_1', '0');
  localStorage.setItem('level_2', '0');
  localStorage.setItem('level_3', '0');
  textArea.value = '';
});
