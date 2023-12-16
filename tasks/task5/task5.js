document.addEventListener('DOMContentLoaded', function () {
  const textField = document.getElementById('text-field');
  const submitButton = document.getElementById('submit-button');
  const wordsList = document.getElementById('wordsList');
  const upContainer = document.getElementById('up');
  const leftContainer = document.getElementById('left');

  let shift;

  updateShift();

  window.addEventListener('resize', function(event) {
    leftContainer.innerHTML = '';
    updateTextarea();
    updateShift();
  });

  submitButton.addEventListener('click', function () {
    const inputText = textField.value;
    if (inputText === "") {
      return;
    }
    textField.value = "";
    const wordsArray = inputText.split('-');
    console.log("Array:");
    console.log(wordsArray);

    const sortedWords = wordsArray.filter(word => isNaN(word) && word !== "").sort();
    const sortedNumbers = wordsArray.filter(word => !isNaN(word) && word !== "").sort((a, b) => a - b);

    const resultMap = {};
    sortedWords.forEach((word, index) => {
      resultMap['a' + (index + 1)] = word;
    });

    sortedNumbers.forEach((number, index) => {
      resultMap['n' + (index + 1)] = number;
    });

    upContainer.innerHTML = '';

    for (const key in resultMap) {
      const block = document.createElement('div');
      block.draggable = true;
      block.id = key;
      block.textContent = `${key} ${resultMap[key]}`;
      block.classList.add('word-block');
      upContainer.appendChild(block);
    }

    leftContainer.innerHTML = '';

    upContainer.childNodes.forEach(block => {
      block.addEventListener('dragstart', function (event) {
        event.dataTransfer.setData('text/plain', block.id);
      });
    });
  });

  leftContainer.addEventListener('dragover', function (event) {
    event.preventDefault();
  });

  leftContainer.addEventListener('drop', function (event) {
    event.preventDefault();
    const data = event.dataTransfer.getData('text/plain');
    const block = document.getElementById(data);

    const mouseX = event.clientX;
    const mouseY = event.clientY;

    const containerLeft = leftContainer.getBoundingClientRect();
    const containerX = containerLeft.left;
    const containerY = containerLeft.top;

    const containerUp = leftContainer.getBoundingClientRect();
    const blockX = mouseX - containerX + 15;
    const blockY = mouseY - containerY + containerUp.height + shift;

    block.style.position = 'absolute';
    block.style.left = blockX + 'px';
    block.style.top = blockY + 'px';
    document.elementFromPoint(mouseX, mouseY);
    leftContainer.appendChild(block);

    updateTextarea();
  });

  function updateTextarea() {
    const blocksInLeft = Array.from(leftContainer.childNodes);
    wordsList.textContent = blocksInLeft.map(block => block.textContent.split(' ')[1]).join(' ');
  }

  function updateShift() {
    if (window.innerWidth >= 768) {
      shift = -45;
    } else {
      shift = 260;
    }
  }
});
