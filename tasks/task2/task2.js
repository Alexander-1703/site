const carButton = document.getElementById('carButton');
const motorcycleButton = document.getElementById('motorcycleButton');
const fuelRange = document.getElementById('fuelRange');
const fuelText = document.getElementById('fuelText');
const resultText = document.getElementById('resultText');
const smileyContainer = document.createElement('div'); // Создаем контейнер для смайлов
smileyContainer.classList.add('smiley-container'); // Добавляем класс контейнеру

function moveAction() {
  setTimeout(function() {
    const answer = confirm('Приступаем?');
    if (answer) {
      resultText.textContent = 'Жизнь продолжается, и мы должны двигаться дальше';
    } else {
      resultText.textContent = 'Даже камень движется дальше';
    }
  }, 300); // задержка, чтобы страница успела прогрузиться
}

document.addEventListener('DOMContentLoaded', moveAction);

carButton.addEventListener('click', () => {
  calculateFuel(10);
});

motorcycleButton.addEventListener('click', () => {
  calculateFuel(5);
});

fuelRange.addEventListener('input', () => {
  fuelText.textContent = `Выберите количество литров бензина: ${fuelRange.value} л`;
});

function calculateFuel(consumption) {
  const distance = parseFloat(prompt('Введите длину пути (км):'));
  if (!isNaN(distance)) {
    const fuelNeeded = (consumption / 100) * distance;
    const smileyImage = document.createElement('img');
    smileyImage.classList.add('smiley');
    if (fuelNeeded <= fuelRange.value) {
      smileyImage.src = 'pics/sm_funny.png';
    } else {
      smileyImage.src = 'pics/sm_sad.png';
    }
    while (smileyContainer.firstChild) {
      smileyContainer.removeChild(smileyContainer.firstChild);
    }
    smileyContainer.appendChild(smileyImage);
    resultText.appendChild(smileyContainer);
  }
}
