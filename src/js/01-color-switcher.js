const startButton = document.querySelector('[data-start]');
const stopButton = document.querySelector('[data-stop]');
const spanColor = document.querySelector('.color');
let timerId = null;

const getRandomHexColor = () =>
  `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, 0)}`;

stopButton.disabled = true;

startButton.addEventListener('click', evt => {
  startButton.disabled = true;
  stopButton.disabled = false;
  timerId = setInterval(() => {
    const bgColor = getRandomHexColor();
    document.body.style.backgroundColor = bgColor;
    spanColor.textContent = `color HEX ${bgColor}`;
  }, 1000);
});

stopButton.addEventListener('click', evt => {
  startButton.disabled = false;
  stopButton.disabled = true;
  clearInterval(timerId);
});

//disebledStartButton
