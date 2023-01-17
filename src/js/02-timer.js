import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const selectorDate = document.querySelector('#datetime-picker');
const valueDays = document.querySelectorAll('[data-days]');
const valueHours = document.querySelectorAll('[data-hours]');
const valueMinutes = document.querySelectorAll('[data-minutes]');
const valueSeconds = document.querySelectorAll('[data-seconds]');
const valuePrevSeconds = document.querySelectorAll('[data-prevSeconds]');
const valuePrevMinutes = document.querySelectorAll('[data-prevMinutes]');
const newSeconds = document.querySelector('.seconds');
const newMinutes = document.querySelector('.minutes');
const startBtn = document.querySelector('[data-start]');

Notify.init({
  width: '400px',
  position: 'left-top', // 'right-top' - 'right-bottom' - 'left-top' - 'left-bottom' - 'center-top' - 'center-bottom' - 'center-center'
  distance: '60px',
  messageMaxLength: 120,
  clickToClose: false,
  fontFamily: 'Roboto',
  fontSize: '18px',
  cssAnimationStyle: 'zoom', // 'fade' - 'zoom' - 'from-right' - 'from-top' - 'from-bottom' - 'from-left'
  closeButton: true,
  fontAwesomeIconSize: '50px',

  success: {
    background: 'rgba(0,200,0,0.9)',
    textColor: '#f8f8f8',
    notiflixIconColor: '#212121',
    fontAwesomeIconColor: 'rgba(0,0,0,0.2)',
    backOverlayColor: 'rgba(50,198,130,0.2)',
  },

  failure: {
    background: 'rgba(200,0,0,0.9)',
    textColor: '#f8f8f8',
    notiflixIconColor: '#212121',
    fontAwesomeIconColor: 'rgba(0,0,0,0.2)',
    backOverlayColor: 'rgba(255,85,73,0.5)',
  },
});

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);
  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return value.toString().padStart(2, 0);
}

function timer(currenTime, interval) {
  const leftTime = currenTime - interval;
  if (leftTime < 1000) return 0;

  const days = addLeadingZero(convertMs(leftTime).days);
  const hours = addLeadingZero(convertMs(leftTime).hours);
  const minutes = addLeadingZero(convertMs(leftTime).minutes);
  const seconds = addLeadingZero(convertMs(leftTime).seconds);
  // const daysPrev = addLeadingZero(convertMs(leftTime - 1000).days);
  // const hoursPrev = addLeadingZero(convertMs(leftTime - 1000).hours);
  const minutesPrev = addLeadingZero(convertMs(leftTime - 1000).minutes);
  const secondsPrev = addLeadingZero(convertMs(leftTime - 1000).seconds);

  //! перегортання днів і годин не робив, тому що ліньки

  valueDays[1].textContent = days;
  valueDays[0].textContent = days;

  valueHours[0].textContent = hours;
  valueHours[1].textContent = hours;

  if (minutesPrev != minutes) newMinutes.classList.toggle('flip');

  valuePrevMinutes[0].textContent = minutesPrev;
  valueMinutes[0].textContent = minutes;
  valueMinutes[1].textContent = minutes;
  valuePrevMinutes[1].textContent = minutesPrev;

  if (secondsPrev != seconds) newSeconds.classList.toggle('flip');

  valuePrevSeconds[0].textContent = secondsPrev;
  valueSeconds[0].textContent = seconds;
  valueSeconds[1].textContent = seconds;
  valuePrevSeconds[1].textContent = secondsPrev;

  return leftTime;
}

let leftTime = 0;

const optionsFP = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  dateFormat: 'Y-m-d H:i',
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0] < Date.now()) {
      Notify.failure('Виберіть дату та час у майбутньому');
      startBtn.disabled = true;
    } else {
      startBtn.disabled = false;
      leftTime = selectedDates[0];
    }
  },
};

startBtn.addEventListener('click', () => {
  startBtn.disabled = true;
  selectorDate.disabled = true;
  leftTime -= Date.now();
  //! -- відкидаємо мілесекунди
  const { days, hours, minutes, seconds } = convertMs(leftTime);
  leftTime = 1000 * (seconds + 60 * (minutes + 60 * (hours + 24 * days)));

  const countDown = setInterval(() => {
    leftTime = timer(leftTime, 500);
    if (leftTime === 0) {
      clearInterval(countDown);
      selectorDate.disabled = false;
      Notify.success('Час вийшов, нехай щастить');
    }
  }, 500);
});

startBtn.disabled = true;
flatpickr(selectorDate, optionsFP);
