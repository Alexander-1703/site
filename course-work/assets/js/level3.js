const cvs = document.getElementById("canvas");
const ctx = cvs.getContext("2d");
const timer = document.getElementById('timer');
const rightColor = "white";
const leftColor = "#23d994";
const TO_RADIANS = Math.PI / 180;

cvs.width = window.innerWidth;
cvs.height = window.innerHeight * 997 / 1000;

// задаем весы
const support = new Image();
support.src = "../assets/img/support.png";
const table = new Image();
table.src = "../assets/img/table.png"
const arm = new Image();
arm.src = "../assets/img/arm.png";
const left_scale = new Image();
left_scale.src = "../assets/img/left.png";
const right_scale = new Image();
right_scale.src = "../assets/img/right.png";

let rect = [];
let leftWeight = [-2, -2, -2];
let rightWeight = [-2, -2, -2];
let tableWeight = [-2, -2];
let armAngle = 0;
let rectFromTable = false;
let seconds = 15;
let selectedNumber = null;
let numbers = getNumbers();
let counter = 0;
let gameOver = false;
let mouse = {
  x: 0,
  y: 0,
  down: false
};

function arraySum(array) {
  let sum = 0;
  for (let i = 0; i < array.length; i++) {
    if (array[i] > -1) {
      sum += array[i] + 1;
    }
  }
  return sum;
}

function maxWeight(x, y) {
  return Math.max(x, y);
}

function getNumbers() {
  let array = [];
  let image;
  for (let i = 1; i <= 9; i++) {
    image = new Image();
    image.src = "../assets/img/" + i + ".png";
    array.push(image);
  }
  return array;
}

function random() {
  return Math.floor(Math.random() * (numbers.length - 4))
}

function randomInteger(min, max) {
  let rand = min + Math.random() * (max - min);
  return Math.floor(rand);
}

function updateTimer() {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  timer.textContent = `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;

  if (seconds === 0) {
    showGameOverScreen();
  } else {
    seconds--;
    setTimeout(updateTimer, 1000);
  }
}

function fillRect(img, x, y) {
  ctx.drawImage(img, x, y);
}

class Rect {
  constructor(x, y, number) {
    this.x = x;
    this.y = y;
    this.w = numbers[number].width;
    this.h = numbers[number].height;
    this.number = number;
    this.img = numbers[number];
  }

  returnNumber() {
    return this.number;
  }

  returnY() {
    return this.y;
  }

  returnX() {
    return this.x;
  }

  update(x, y) {
    this.x += x;
    this.y += y;
  }

  draw() {
    fillRect(this.img, this.x, this.y);
  }
}


function isCursorInRect(rect) {
  return mouse.x > rect.x && mouse.x < rect.x + 90 && mouse.y > rect.y && mouse.y < rect.y + 120;
}

// настройка угла arm у весов
function drawArm() {
  let i;
  ctx.save();
  ctx.translate((2 * cvs.width / 3), cvs.height - 88 * support.height / 100);
  if (arraySum(leftWeight) === 0 && arraySum(rightWeight) !== 0) {
    armAngle = 40;
  }
  if (arraySum(rightWeight) === 0 && arraySum(leftWeight) !== 0) {
    armAngle = -40;
  }
  ctx.rotate(armAngle * TO_RADIANS);
  ctx.drawImage(arm, -(arm.width / 2), -(arm.height / 2));
  ctx.rotate(-armAngle * TO_RADIANS);
  if (armAngle >= 0) {
    //левая scale
    ctx.drawImage(left_scale, -(arm.width / 2) - left_scale.width / 2 + armAngle, -(6 * arm.height) - armAngle * 4.5 + 80);
    // отображение цифр слева
    for (i = 0; i < 3; i++) {
      if (leftWeight[i] > -1) {
        ctx.drawImage(numbers[leftWeight[i]], -(arm.width / 2) - left_scale.width / 2 + armAngle - 30 + 70 * i, -(6 * arm.height) - armAngle * 4.5 + 200)
      }
    }
    //правая scale
    ctx.drawImage(right_scale, (arm.width / 2) - left_scale.width / 2 - armAngle, -(6 * arm.height) + armAngle * 4 + 80);
    //отображение цифр на весах
    for (i = 0; i < 3; i++) {
      if (rightWeight[i] > -1) {
        ctx.drawImage(numbers[rightWeight[i]], (arm.width / 2) - left_scale.width / 2 - armAngle - 30 + 70 * i, -(6 * arm.height) + armAngle * 4 + 200)
      }
    }
  }
  if (armAngle < 0) {
    ctx.drawImage(left_scale, -(arm.width / 2) - left_scale.width / 2 - armAngle, -(6 * arm.height) - armAngle * 4 + 80);
    for (i = 0; i < 3; i++) {
      if (leftWeight[i] > -1) {
        ctx.drawImage(numbers[leftWeight[i]], -(arm.width / 2) - left_scale.width / 2 - armAngle - 30 + 70 * i, -(6 * arm.height) - armAngle * 4 + 200)
      }
    }
    ctx.drawImage(right_scale, (arm.width / 2) - left_scale.width / 2 + armAngle, -(6 * arm.height) + armAngle * 4.5 + 80);
    for (i = 0; i < 3; i++) {
      if (rightWeight[i] > -1) {
        ctx.drawImage(numbers[rightWeight[i]], (arm.width / 2) - left_scale.width / 2 + armAngle - 30 + 70 * i, -(6 * arm.height) + armAngle * 4.5 + 200)
      }
    }
  }
  ctx.restore();
  ctx.drawImage(support, 2 * cvs.width / 3 - support.width / 2, cvs.height - support.height);
  ctx.drawImage(table, 3 / 5 * cvs.width, cvs.height - support.height / 2);
  for (i = 0; i < 2; i++) {
    if (tableWeight[i] > -1) {
      ctx.drawImage(numbers[tableWeight[i]], 3 / 5 * cvs.width + 55 / 100 * table.width * i, cvs.height - support.height / 2);
    }
  }
}

function isCursorInTable() {
  if (mouse.y > cvs.height - support.height) {
    if (mouse.x > 3 / 5 * cvs.width && mouse.x < 3 / 5 * cvs.width + 1 / 2 * table.width) {
      rectFromTable = true;
      selectedNumber = new Rect(3 / 5 * cvs.width + 1 / 2 * table.width, cvs.height - 1 / 2 * support.height, tableWeight[0]);
      tableWeight[0] = -2;
    } else if (mouse.x > 3 / 5 * cvs.width + 1 / 2 * table.width && mouse.x < 3 / 5 * cvs.width + table.width) {
      rectFromTable = true;
      selectedNumber = new Rect(3 / 5 * cvs.width + 1 / 2 * table.width, cvs.height - 1 / 2 * support.height, tableWeight[1]);
      tableWeight[1] = -2;
    }
  }
}


function rendering() {

  ctx.fillStyle = rightColor; // стиль справа
  ctx.fillRect(cvs.width / 3, 0, 2 * cvs.width / 3, cvs.height);
  ctx.fillStyle = leftColor; // стиль слева
  ctx.fillRect(0, 0, cvs.width / 3, cvs.height);

  drawArm();
  if (rectFromTable) {
    selectedNumber.draw();
  }
  rect[counter].draw();
  let speed = 4;
  rect[counter].update(randomInteger(-15, 15), speed);
  if (rect[counter].returnY() >= cvs.height
    || (rect[counter].returnX() < -20 && selectedNumber == null)
    || (rect[counter].returnX() > 20 + cvs.width / 3 && selectedNumber == null)) {
    counter++;
  }
  if (selectedNumber !== null) {
    selectedNumber.x = mouse.x - 45;
    selectedNumber.y = mouse.y - 65;
  }
  requestAnimationFrame(rendering);
}

function isInLeftScale() {
  return selectedNumber !== null && mouse.x > 2 * cvs.width / 3 - arm.width / 2 - left_scale.width / 2 && mouse.x < 2 * cvs.width / 3 - arm.width / 2 - left_scale.width / 2 + left_scale.width;
}

function isInRightScale() {
  return selectedNumber !== null && mouse.x > 2 * cvs.width / 3 + arm.width / 2 - right_scale.width / 2 && mouse.x < 2 * cvs.width / 3 + arm.width / 2 - right_scale.width / 2 + right_scale.width;
}

function showGameOverScreen() {
  let score = 0;
  let scoreLeft = 0;
  let scoreRight = 0;
  for (let i in leftWeight) {
    if (leftWeight[i] !== -2) {
      scoreLeft += leftWeight[i] + 1;
    }
    if (rightWeight[i] !== -2) {
      scoreRight += rightWeight[i] + 1;
    }
  }
  if (scoreLeft === scoreRight) {
    score = scoreLeft;
  }
  gameOver = true;

  localStorage.setItem('level_3', score.toString());

  document.getElementById('score').textContent = score.toString();
  let nextLevel = document.getElementById('nextButton');
  if (score === 0) {
    nextLevel.style.display = 'none';
  } else {
    nextLevel.style.display = 'inline-block';
  }
  document.getElementById('gameOverScreen').style.display = 'block';
}

document.querySelector('.button[value="Заново"]').addEventListener('click', function () {
  window.location.href = this.getAttribute('data-href');
});

updateTimer();

//отрисовка падающих цифр
for (let i = 0; i < seconds * 10; i++) {
  let shiftByOx = 100;
  rect.push(new Rect(randomInteger(0, 4) * shiftByOx, 0, random()));
}

arm.onload = function () {
  rendering();
}

window.onmousemove = function (e) {
  mouse.x = e.pageX;
  mouse.y = e.pageY;
};

// При нажатии мыши
window.onmousedown = function () {
  if (gameOver) {
    return;
  }
  mouse.down = true;
  if (tableWeight[0] !== -2 || tableWeight[1] !== -2) {
    isCursorInTable();
  }
  if (selectedNumber === null) {
    for (let i in rect) {
      if (isCursorInRect(rect[i])) {
        selectedNumber = rect[i];
      }
    }
  }
}

// При отпускании мыши
window.onmouseup = function () {
  if (rectFromTable) {
    if (isInLeftScale()) {
      if (leftWeight.indexOf(-2) !== -1) {
        leftWeight[leftWeight.indexOf(-2)] = selectedNumber.returnNumber();
        armAngle = 40 * (arraySum(rightWeight) - arraySum(leftWeight)) / maxWeight(arraySum(rightWeight), arraySum(leftWeight));
      }
    } else if (isInRightScale()) {
      if (rightWeight.indexOf(-2) !== -1) {
        rightWeight[rightWeight.indexOf(-2)] = selectedNumber.returnNumber();
        armAngle = 40 * (arraySum(rightWeight) - arraySum(leftWeight)) / maxWeight(arraySum(rightWeight), arraySum(leftWeight));
      }
    } else {
      return;
    }
  } else {
    if (selectedNumber !== null && mouse.x > 3 / 5 * cvs.width && mouse.x < 3 / 5 * cvs.width + table.width
      && mouse.y > cvs.height - support.height && tableWeight.indexOf(-2) !== -1) {
      tableWeight[tableWeight.indexOf(-2)] = rect[counter].returnNumber();
      counter++;
    }
    if (isInLeftScale()) {
      if (leftWeight.indexOf(-2) !== -1) {
        leftWeight[leftWeight.indexOf(-2)] = rect[counter].returnNumber();
        armAngle = 40 * (arraySum(rightWeight) - arraySum(leftWeight)) / maxWeight(arraySum(rightWeight), arraySum(leftWeight));
      }
      counter++;
    }
    if (isInRightScale()) {
      if (rightWeight.indexOf(-2) !== -1) {
        rightWeight[rightWeight.indexOf(-2)] = rect[counter].returnNumber();
        armAngle = 40 * (arraySum(rightWeight) - arraySum(leftWeight)) / maxWeight(arraySum(rightWeight), arraySum(leftWeight));
      }
      counter++;
    }
  }
  rectFromTable = false;
  mouse.down = false;
  selectedNumber = null;
  if (rightWeight.indexOf(-2) === -1 && arraySum(leftWeight) === arraySum(rightWeight)
    || leftWeight.indexOf(-2) === -1 && arraySum(leftWeight) === arraySum(rightWeight)
    || rightWeight.indexOf(-2) === -1 && leftWeight.indexOf(-2) === -1) {
    seconds = 0;
    updateTimer();
  }
}
